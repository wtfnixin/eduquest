import { GoogleGenAI, Type } from '@google/genai';
import type { Lesson, QuizQuestion } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const quizSchema = {
    type: Type.OBJECT,
    properties: {
        quiz: {
            type: Type.ARRAY,
            description: "An array of quiz questions.",
            items: {
                type: Type.OBJECT,
                properties: {
                    question: {
                        type: Type.STRING,
                        description: "The quiz question."
                    },
                    options: {
                        type: Type.ARRAY,
                        description: "An array of 4 possible answers.",
                        items: {
                            type: Type.STRING
                        }
                    },
                    correctAnswer: {
                        type: Type.STRING,
                        description: "The correct answer from the options."
                    }
                },
                required: ["question", "options", "correctAnswer"]
            }
        }
    },
    required: ["quiz"]
};

const lessonSchema = {
    type: Type.OBJECT,
    properties: {
        title: { type: Type.STRING },
        story: {
            type: Type.ARRAY,
            description: "An array of story parts, which can be a paragraph of the story or an interactive challenge.",
            items: {
                type: Type.OBJECT,
                properties: {
                    type: {
                        type: Type.STRING,
                        enum: ["story", "challenge"],
                        description: "The type of content part."
                    },
                    content: {
                        type: Type.STRING,
                        description: "The text content for the story part or challenge."
                    }
                },
                required: ["type", "content"]
            }
        }
    },
    required: ["title", "story"]
};

export const getNcertTopics = async (
    subject: string,
    grade: number,
    language: string
): Promise<string[]> => {
    const prompt = `
    You are an expert on the Indian NCERT curriculum.
    Your task is to provide a list of key topics for a specific class and subject.

    Class: ${grade}
    Subject: ${subject}
    Language: ${language}

    Please list between 5 and 8 main topics or chapters.
    Return ONLY a JSON object with a single key "topics", which is an array of strings.
    Example format: {"topics": ["Topic 1", "Topic 2"]}
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        topics: {
                            type: Type.ARRAY,
                            items: { type: Type.STRING }
                        }
                    },
                    required: ["topics"]
                }
            }
        });
        
        const jsonString = response.text.trim();
        const parsedResponse = JSON.parse(jsonString);

        if (!parsedResponse.topics || !Array.isArray(parsedResponse.topics)) {
            throw new Error("Invalid response structure for topics from Gemini API.");
        }

        return parsedResponse.topics;

    } catch (error) {
        console.error("Error generating NCERT topics from Gemini:", error);
        throw new Error("Failed to generate topics. Please check your API key and connection.");
    }
};

export const generateLessonAndQuiz = async (
  subject: string,
  topic: string,
  grade: number,
  language: string
): Promise<{ lesson: Lesson; quiz: QuizQuestion[] }> => {
  const prompt = `
    You are an expert educator creating content for a gamified learning app for rural students.
    Your audience is a child in Class ${grade}.
    The lesson and quiz MUST be based on the Indian NCERT curriculum for this grade level.
    The language for the output must be ${language}.

    Task:
    1.  Create a short, engaging, and simple story-based lesson on the subject "${subject}" and the topic "${topic}".
    2.  The lesson must be GAMIFIED and INTERACTIVE. Break the story into multiple parts. Intersperse the story with fun, simple "challenges" or "activities" that make the student think or imagine something related to the topic.
    3.  Based *only* on the story you just wrote, create a quiz with 3 multiple-choice questions. Each question must have 4 options.

    The final output MUST be a single JSON object.
  `;

  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    lesson: lessonSchema,
                    quiz: quizSchema.properties.quiz
                },
                required: ["lesson", "quiz"]
            }
        }
    });

    const jsonString = response.text.trim();
    const parsedResponse = JSON.parse(jsonString);

    if (!parsedResponse.lesson || !parsedResponse.quiz) {
        throw new Error("Invalid response structure from Gemini API.");
    }

    const lesson: Lesson = parsedResponse.lesson;
    const quiz: QuizQuestion[] = parsedResponse.quiz;

    return { lesson, quiz };

  } catch (error) {
    console.error("Error generating content from Gemini:", error);
    throw new Error("Failed to generate lesson and quiz. Please check your API key and connection.");
  }
};