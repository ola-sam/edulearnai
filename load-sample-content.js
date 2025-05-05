import { db } from './server/db.js';
import { 
  mathLessons, 
  englishLessons, 
  scienceLessons, 
  quizzes 
} from './sample-lessons.js';
import { 
  subjects, 
  lessons, 
  quizzes as quizzesTable 
} from './shared/schema.js';

/**
 * Script to load sample lessons and quizzes into the database
 */
async function loadSampleContent() {
  console.log('Loading sample content into the database...');
  
  try {
    // Make sure the required subjects exist (Math, English, Science)
    const existingSubjects = await db.select().from(subjects);
    
    // If no subjects exist, create them
    if (existingSubjects.length === 0) {
      console.log('Creating subjects...');
      await db.insert(subjects).values([
        {
          name: "Mathematics",
          icon: "calculate",
          color: "#3B82F6" // Primary blue
        },
        {
          name: "English",
          icon: "menu_book",
          color: "#F59E0B" // Warning yellow
        },
        {
          name: "Science",
          icon: "science",
          color: "#10B981" // Success green
        }
      ]);
    }
    
    // Fetch the subjects to get their IDs
    const subjectsData = await db.select().from(subjects);
    console.log('Subjects:', subjectsData);
    
    // Create a map of subject names to IDs
    const subjectMap = {};
    subjectsData.forEach(subject => {
      subjectMap[subject.name] = subject.id;
    });
    
    // Insert math lessons
    console.log('Inserting math lessons...');
    const mathLessonIds = [];
    for (const lesson of mathLessons) {
      // Update the subjectId based on the subject name
      lesson.subjectId = subjectMap['Mathematics'];
      
      // Insert the lesson
      const [newLesson] = await db.insert(lessons).values(lesson).returning();
      mathLessonIds.push(newLesson.id);
      console.log(`Created math lesson: ${newLesson.title} with ID ${newLesson.id}`);
    }
    
    // Insert English lessons
    console.log('Inserting English lessons...');
    const englishLessonIds = [];
    for (const lesson of englishLessons) {
      // Update the subjectId based on the subject name
      lesson.subjectId = subjectMap['English'];
      
      // Insert the lesson
      const [newLesson] = await db.insert(lessons).values(lesson).returning();
      englishLessonIds.push(newLesson.id);
      console.log(`Created English lesson: ${newLesson.title} with ID ${newLesson.id}`);
    }
    
    // Insert science lessons
    console.log('Inserting science lessons...');
    const scienceLessonIds = [];
    for (const lesson of scienceLessons) {
      // Update the subjectId based on the subject name
      lesson.subjectId = subjectMap['Science'];
      
      // Insert the lesson
      const [newLesson] = await db.insert(lessons).values(lesson).returning();
      scienceLessonIds.push(newLesson.id);
      console.log(`Created science lesson: ${newLesson.title} with ID ${newLesson.id}`);
    }
    
    // Combine all lesson IDs for reference when creating quizzes
    const allLessonIds = [...mathLessonIds, ...englishLessonIds, ...scienceLessonIds];
    
    // Insert quizzes
    console.log('Inserting quizzes...');
    for (let i = 0; i < quizzes.length; i++) {
      const quiz = quizzes[i];
      
      // Associate each quiz with the corresponding lesson by index
      // Note: This assumes that quizzes and lessons are in the same order
      if (i < allLessonIds.length) {
        quiz.lessonId = allLessonIds[i];
        
        // Insert the quiz
        const [newQuiz] = await db.insert(quizzesTable).values(quiz).returning();
        console.log(`Created quiz: ${newQuiz.title} with ID ${newQuiz.id} for lesson ID ${newQuiz.lessonId}`);
      }
    }
    
    console.log('Sample content loaded successfully!');
  } catch (error) {
    console.error('Error loading sample content:', error);
  } finally {
    // End the process
    process.exit(0);
  }
}

// Run the script
loadSampleContent();