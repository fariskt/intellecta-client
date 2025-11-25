import { create } from "zustand";
import { lessons } from "../data";
import { Lesson } from "../types";

type LessonStore = {
  lessonData: Record<string, Lesson[]>;
  initializeLessons: (courseId: string) => void;
  updateLesson: (courseId: string, lessonId: string, updates: Partial<Lesson>) => void;
  getProgress: (courseId: string) => number;
  resetLessons: (courseId: string) => void;
};

export const useLessonStore = create<LessonStore>((set, get) => ({
  lessonData: {},
  
  initializeLessons: (courseId: string) => {
    const courseLessons = lessons.filter((item) => item.courseId === courseId);
    if (!get().lessonData[courseId]) {
      set((state: any) => ({
        lessonData: {
          ...state.lessonData,
          [courseId]: courseLessons.map((lesson) => ({ ...lesson })),
        },
      }));
    }
  },

  updateLesson: (courseId: string, lessonId: string, updates: Partial<Lesson>) => {
    set((state) => {
      const updatedLessons = (state.lessonData[courseId] || []).map((lesson) =>
        lesson._id === lessonId ? { ...lesson, ...updates } : lesson
      );
      return {
        lessonData: {
          ...state.lessonData,
          [courseId]: updatedLessons,
        },
      };
    });
  },

  getProgress: (courseId: string) => {
    const courseLessons = get().lessonData[courseId] || [];
    const totalLessons = courseLessons.length;
    const completedLessons = courseLessons.filter((lesson) => lesson.completed).length;
    return totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
  },

  resetLessons: () => {
    // set(() => ({
    //   lessonData: {
    //     ...get().lessonData,
    //     [courseId]: lessons
    //       .filter((item) => item.courseId === courseId)
    //       .map((lesson) => ({ ...lesson })),
    //   },
    // }));
  },
}));
