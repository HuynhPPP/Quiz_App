import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Question from '../models/Question.js';
import Category from '../models/Category.js';

// Load environment variables
dotenv.config();

const migrateQuestionsToCategories = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Get all unique categories from questions
    const uniqueCategories = await Question.distinct('category');
    console.log(`📋 Found ${uniqueCategories.length} unique categories:`, uniqueCategories);

    // Create categories for each unique category
    for (const categoryName of uniqueCategories) {
      if (!categoryName) continue; // Skip empty categories

      // Check if category already exists
      const existingCategory = await Category.findOne({ name: categoryName });
      
      if (!existingCategory) {
        // Determine emoji based on category name
        let emoji = '🌏'; // default
        if (categoryName.includes('Europe') || categoryName.includes('Châu Âu')) {
          emoji = '🇪🇺';
        } else if (categoryName.includes('Asia') || categoryName.includes('Châu Á')) {
          emoji = '🇯🇵';
        } else if (categoryName.includes('Southeast') || categoryName.includes('Đông Nam')) {
          emoji = '🇹🇭';
        } else if (categoryName.includes('South') || categoryName.includes('Nam')) {
          emoji = '🇮🇳';
        } else if (categoryName.includes('Central') || categoryName.includes('Trung')) {
          emoji = '🇰🇿';
        } else if (categoryName.includes('Học tiếng Anh') || categoryName.includes('English')) {
          emoji = '📚';
        } else if (categoryName.includes('Bóng đá') || categoryName.includes('Football')) {
          emoji = '⚽';
        }

        // Create new category
        const newCategory = new Category({
          name: categoryName,
          description: `Danh mục ${categoryName}`,
          emoji: emoji,
          questionCount: 0 // Will be updated below
        });

        await newCategory.save();
        console.log(`✅ Created category: ${emoji} ${categoryName}`);
      } else {
        console.log(`⏭️ Category already exists: ${categoryName}`);
      }
    }

    // Update question counts for all categories
    const allCategories = await Category.find();
    for (const category of allCategories) {
      const questionCount = await Question.countDocuments({ category: category.name });
      category.questionCount = questionCount;
      await category.save();
      console.log(`📊 Updated ${category.name}: ${questionCount} questions`);
    }

    console.log('🎉 Migration completed successfully!');
    
    // Show summary
    const totalCategories = await Category.countDocuments();
    const totalQuestions = await Question.countDocuments();
    console.log(`\n📈 Summary:`);
    console.log(`- Total categories: ${totalCategories}`);
    console.log(`- Total questions: ${totalQuestions}`);

  } catch (error) {
    console.error('❌ Migration failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
    process.exit(0);
  }
};

// Run migration
migrateQuestionsToCategories();
