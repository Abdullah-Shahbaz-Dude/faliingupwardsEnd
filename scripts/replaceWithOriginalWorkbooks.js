const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

// Connection URI
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/falling-upward';

// Workbook Schema (matching your existing structure with new template fields)
const workbookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  content: { type: String, default: "" },
  link: { type: String, default: null },
  questions: [{
    question: { type: String, required: true },
    answer: { type: String, default: "" },
  }],
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  status: {
    type: String,
    enum: ["assigned", "in_progress", "completed", "submitted", "reviewed"],
    default: "assigned",
  },
  userResponse: { type: String, default: "" },
  adminFeedback: { type: String, default: "" },
  shareableLink: { type: String, default: "" },
  isTemplate: { type: Boolean, default: true }, // New field for templates
  templateId: { type: mongoose.Schema.Types.ObjectId, ref: "Workbook", default: null }, // New field
}, { timestamps: true });

const Workbook = mongoose.model('Workbook', workbookSchema);

// YOUR ORIGINAL WORKBOOKS DATA
// REPLACE THIS SECTION WITH YOUR ACTUAL WORKBOOKS
const originalWorkbooks = [
  {
    title: "Time Management and Executive Functioning",
    description: "This workbook focuses on developing practical time management skills and executive functioning strategies specifically designed for individuals with ADHD.",
    questions: [
      {
        question: "What are your biggest challenges with time management in your daily life?",
        answer: ""
      },
      {
        question: "Describe a typical morning routine. What works well and what doesn't?",
        answer: ""
      },
      {
        question: "How do you currently prioritize tasks when you have multiple things to do?",
        answer: ""
      },
      {
        question: "What strategies have you tried for staying organized, and which ones worked best?",
        answer: ""
      },
      {
        question: "How do you handle interruptions or unexpected changes to your schedule?",
        answer: ""
      }
    ]
  },
  {
    title: "Emotional Regulation and Self-Awareness",
    description: "Explore emotional patterns, triggers, and develop strategies for managing intense emotions that often accompany ADHD.",
    questions: [
      {
        question: "What emotions do you find most difficult to manage or control?",
        answer: ""
      },
      {
        question: "Can you identify specific situations or triggers that lead to emotional overwhelm?",
        answer: ""
      },
      {
        question: "How do you currently cope when you're feeling overwhelmed or stressed?",
        answer: ""
      },
      {
        question: "Describe a time when you successfully managed a difficult emotion. What helped?",
        answer: ""
      },
      {
        question: "How do your emotions affect your ability to focus or complete tasks?",
        answer: ""
      }
    ]
  },
  {
    title: "Focus and Attention Strategies",
    description: "Develop personalized strategies for improving focus, managing distractions, and maintaining attention on important tasks.",
    questions: [
      {
        question: "In what environments do you find it easiest to focus and concentrate?",
        answer: ""
      },
      {
        question: "What are your most common distractions throughout the day?",
        answer: ""
      },
      {
        question: "How long can you typically maintain focus on different types of tasks?",
        answer: ""
      },
      {
        question: "What techniques or tools have you used to improve your focus?",
        answer: ""
      },
      {
        question: "How do you get back on track when your attention wanders during important tasks?",
        answer: ""
      }
    ]
  },

   {
    title: "Time Management and Executive Functioning",
    description: "This workbook focuses on developing practical time management skills and executive functioning strategies specifically designed for individuals with ADHD.",
    questions: [
      {
        question: "What are your biggest challenges with time management in your daily life?",
        answer: ""
      },
      {
        question: "Describe a typical morning routine. What works well and what doesn't?",
        answer: ""
      },
      {
        question: "How do you currently prioritize tasks when you have multiple things to do?",
        answer: ""
      },
      {
        question: "What strategies have you tried for staying organized, and which ones worked best?",
        answer: ""
      },
      {
        question: "How do you handle interruptions or unexpected changes to your schedule?",
        answer: ""
      }
    ]
  }, {
    title: "Time Management and Executive Functioning",
    description: "This workbook focuses on developing practical time management skills and executive functioning strategies specifically designed for individuals with ADHD.",
    questions: [
      {
        question: "What are your biggest challenges with time management in your daily life?",
        answer: ""
      },
      {
        question: "Describe a typical morning routine. What works well and what doesn't?",
        answer: ""
      },
      {
        question: "How do you currently prioritize tasks when you have multiple things to do?",
        answer: ""
      },
      {
        question: "What strategies have you tried for staying organized, and which ones worked best?",
        answer: ""
      },
      {
        question: "How do you handle interruptions or unexpected changes to your schedule?",
        answer: ""
      }
    ]
  }
  , {
    title: "Time Management and Executive Functioning",
    description: "This workbook focuses on developing practical time management skills and executive functioning strategies specifically designed for individuals with ADHD.",
    questions: [
      {
        question: "What are your biggest challenges with time management in your daily life?",
        answer: ""
      },
      {
        question: "Describe a typical morning routine. What works well and what doesn't?",
        answer: ""
      },
      {
        question: "How do you currently prioritize tasks when you have multiple things to do?",
        answer: ""
      },
      {
        question: "What strategies have you tried for staying organized, and which ones worked best?",
        answer: ""
      },
      {
        question: "How do you handle interruptions or unexpected changes to your schedule?",
        answer: ""
      }
    ]
  }, {
    title: "Time Management and Executive Functioning",
    description: "This workbook focuses on developing practical time management skills and executive functioning strategies specifically designed for individuals with ADHD.",
    questions: [
      {
        question: "What are your biggest challenges with time management in your daily life?",
        answer: ""
      },
      {
        question: "Describe a typical morning routine. What works well and what doesn't?",
        answer: ""
      },
      {
        question: "How do you currently prioritize tasks when you have multiple things to do?",
        answer: ""
      },
      {
        question: "What strategies have you tried for staying organized, and which ones worked best?",
        answer: ""
      },
      {
        question: "How do you handle interruptions or unexpected changes to your schedule?",
        answer: ""
      }
    ]
  }, {
    title: "Time Management and Executive Functioning",
    description: "This workbook focuses on developing practical time management skills and executive functioning strategies specifically designed for individuals with ADHD.",
    questions: [
      {
        question: "What are your biggest challenges with time management in your daily life?",
        answer: ""
      },
      {
        question: "Describe a typical morning routine. What works well and what doesn't?",
        answer: ""
      },
      {
        question: "How do you currently prioritize tasks when you have multiple things to do?",
        answer: ""
      },
      {
        question: "What strategies have you tried for staying organized, and which ones worked best?",
        answer: ""
      },
      {
        question: "How do you handle interruptions or unexpected changes to your schedule?",
        answer: ""
      }
    ]
  }, {
    title: "Time Management and Executive Functioning",
    description: "This workbook focuses on developing practical time management skills and executive functioning strategies specifically designed for individuals with ADHD.",
    questions: [
      {
        question: "What are your biggest challenges with time management in your daily life?",
        answer: ""
      },
      {
        question: "Describe a typical morning routine. What works well and what doesn't?",
        answer: ""
      },
      {
        question: "How do you currently prioritize tasks when you have multiple things to do?",
        answer: ""
      },
      {
        question: "What strategies have you tried for staying organized, and which ones worked best?",
        answer: ""
      },
      {
        question: "How do you handle interruptions or unexpected changes to your schedule?",
        answer: ""
      }
    ]
  }, {
    title: "Time Management and Executive Functioning",
    description: "This workbook focuses on developing practical time management skills and executive functioning strategies specifically designed for individuals with ADHD.",
    questions: [
      {
        question: "What are your biggest challenges with time management in your daily life?",
        answer: ""
      },
      {
        question: "Describe a typical morning routine. What works well and what doesn't?",
        answer: ""
      },
      {
        question: "How do you currently prioritize tasks when you have multiple things to do?",
        answer: ""
      },
      {
        question: "What strategies have you tried for staying organized, and which ones worked best?",
        answer: ""
      },
      {
        question: "How do you handle interruptions or unexpected changes to your schedule?",
        answer: ""
      }
    ]
  }, {
    title: "Time Management and Executive Functioning",
    description: "This workbook focuses on developing practical time management skills and executive functioning strategies specifically designed for individuals with ADHD.",
    questions: [
      {
        question: "What are your biggest challenges with time management in your daily life?",
        answer: ""
      },
      {
        question: "Describe a typical morning routine. What works well and what doesn't?",
        answer: ""
      },
      {
        question: "How do you currently prioritize tasks when you have multiple things to do?",
        answer: ""
      },
      {
        question: "What strategies have you tried for staying organized, and which ones worked best?",
        answer: ""
      },
      {
        question: "How do you handle interruptions or unexpected changes to your schedule?",
        answer: ""
      }
    ]
  }, {
    title: "Time Management and Executive Functioning",
    description: "This workbook focuses on developing practical time management skills and executive functioning strategies specifically designed for individuals with ADHD.",
    questions: [
      {
        question: "What are your biggest challenges with time management in your daily life?",
        answer: ""
      },
      {
        question: "Describe a typical morning routine. What works well and what doesn't?",
        answer: ""
      },
      {
        question: "How do you currently prioritize tasks when you have multiple things to do?",
        answer: ""
      },
      {
        question: "What strategies have you tried for staying organized, and which ones worked best?",
        answer: ""
      },
      {
        question: "How do you handle interruptions or unexpected changes to your schedule?",
        answer: ""
      }
    ]
  }, {
    title: "Time Management and Executive Functioning",
    description: "This workbook focuses on developing practical time management skills and executive functioning strategies specifically designed for individuals with ADHD.",
    questions: [
      {
        question: "What are your biggest challenges with time management in your daily life?",
        answer: ""
      },
      {
        question: "Describe a typical morning routine. What works well and what doesn't?",
        answer: ""
      },
      {
        question: "How do you currently prioritize tasks when you have multiple things to do?",
        answer: ""
      },
      {
        question: "What strategies have you tried for staying organized, and which ones worked best?",
        answer: ""
      },
      {
        question: "How do you handle interruptions or unexpected changes to your schedule?",
        answer: ""
      }
    ]
  }, {
    title: "Time Management and Executive Functioning",
    description: "This workbook focuses on developing practical time management skills and executive functioning strategies specifically designed for individuals with ADHD.",
    questions: [
      {
        question: "What are your biggest challenges with time management in your daily life?",
        answer: ""
      },
      {
        question: "Describe a typical morning routine. What works well and what doesn't?",
        answer: ""
      },
      {
        question: "How do you currently prioritize tasks when you have multiple things to do?",
        answer: ""
      },
      {
        question: "What strategies have you tried for staying organized, and which ones worked best?",
        answer: ""
      },
      {
        question: "How do you handle interruptions or unexpected changes to your schedule?",
        answer: ""
      }
    ]
  }, {
    title: "Time Management and Executive Functioning",
    description: "This workbook focuses on developing practical time management skills and executive functioning strategies specifically designed for individuals with ADHD.",
    questions: [
      {
        question: "What are your biggest challenges with time management in your daily life?",
        answer: ""
      },
      {
        question: "Describe a typical morning routine. What works well and what doesn't?",
        answer: ""
      },
      {
        question: "How do you currently prioritize tasks when you have multiple things to do?",
        answer: ""
      },
      {
        question: "What strategies have you tried for staying organized, and which ones worked best?",
        answer: ""
      },
      {
        question: "How do you handle interruptions or unexpected changes to your schedule?",
        answer: ""
      }
    ]
  }, {
    title: "Time Management and Executive Functioning",
    description: "This workbook focuses on developing practical time management skills and executive functioning strategies specifically designed for individuals with ADHD.",
    questions: [
      {
        question: "What are your biggest challenges with time management in your daily life?",
        answer: ""
      },
      {
        question: "Describe a typical morning routine. What works well and what doesn't?",
        answer: ""
      },
      {
        question: "How do you currently prioritize tasks when you have multiple things to do?",
        answer: ""
      },
      {
        question: "What strategies have you tried for staying organized, and which ones worked best?",
        answer: ""
      },
      {
        question: "How do you handle interruptions or unexpected changes to your schedule?",
        answer: ""
      }
    ]
  }, {
    title: "Time Management and Executive Functioning",
    description: "This workbook focuses on developing practical time management skills and executive functioning strategies specifically designed for individuals with ADHD.",
    questions: [
      {
        question: "What are your biggest challenges with time management in your daily life?",
        answer: ""
      },
      {
        question: "Describe a typical morning routine. What works well and what doesn't?",
        answer: ""
      },
      {
        question: "How do you currently prioritize tasks when you have multiple things to do?",
        answer: ""
      },
      {
        question: "What strategies have you tried for staying organized, and which ones worked best?",
        answer: ""
      },
      {
        question: "How do you handle interruptions or unexpected changes to your schedule?",
        answer: ""
      }
    ]
  }, {
    title: "Time Management and Executive Functioning",
    description: "This workbook focuses on developing practical time management skills and executive functioning strategies specifically designed for individuals with ADHD.",
    questions: [
      {
        question: "What are your biggest challenges with time management in your daily life?",
        answer: ""
      },
      {
        question: "Describe a typical morning routine. What works well and what doesn't?",
        answer: ""
      },
      {
        question: "How do you currently prioritize tasks when you have multiple things to do?",
        answer: ""
      },
      {
        question: "What strategies have you tried for staying organized, and which ones worked best?",
        answer: ""
      },
      {
        question: "How do you handle interruptions or unexpected changes to your schedule?",
        answer: ""
      }
    ]
  }, {
    title: "Time Management and Executive Functioning",
    description: "This workbook focuses on developing practical time management skills and executive functioning strategies specifically designed for individuals with ADHD.",
    questions: [
      {
        question: "What are your biggest challenges with time management in your daily life?",
        answer: ""
      },
      {
        question: "Describe a typical morning routine. What works well and what doesn't?",
        answer: ""
      },
      {
        question: "How do you currently prioritize tasks when you have multiple things to do?",
        answer: ""
      },
      {
        question: "What strategies have you tried for staying organized, and which ones worked best?",
        answer: ""
      },
      {
        question: "How do you handle interruptions or unexpected changes to your schedule?",
        answer: ""
      }
    ]
  }, {
    title: "Time Management and Executive Functioning",
    description: "This workbook focuses on developing practical time management skills and executive functioning strategies specifically designed for individuals with ADHD.",
    questions: [
      {
        question: "What are your biggest challenges with time management in your daily life?",
        answer: ""
      },
      {
        question: "Describe a typical morning routine. What works well and what doesn't?",
        answer: ""
      },
      {
        question: "How do you currently prioritize tasks when you have multiple things to do?",
        answer: ""
      },
      {
        question: "What strategies have you tried for staying organized, and which ones worked best?",
        answer: ""
      },
      {
        question: "How do you handle interruptions or unexpected changes to your schedule?",
        answer: ""
      }
    ]
  }, {
    title: "Time Management and Executive Functioning",
    description: "This workbook focuses on developing practical time management skills and executive functioning strategies specifically designed for individuals with ADHD.",
    questions: [
      {
        question: "What are your biggest challenges with time management in your daily life?",
        answer: ""
      },
      {
        question: "Describe a typical morning routine. What works well and what doesn't?",
        answer: ""
      },
      {
        question: "How do you currently prioritize tasks when you have multiple things to do?",
        answer: ""
      },
      {
        question: "What strategies have you tried for staying organized, and which ones worked best?",
        answer: ""
      },
      {
        question: "How do you handle interruptions or unexpected changes to your schedule?",
        answer: ""
      }
    ]
  }, {
    title: "Time Management and Executive Functioning",
    description: "This workbook focuses on developing practical time management skills and executive functioning strategies specifically designed for individuals with ADHD.",
    questions: [
      {
        question: "What are your biggest challenges with time management in your daily life?",
        answer: ""
      },
      {
        question: "Describe a typical morning routine. What works well and what doesn't?",
        answer: ""
      },
      {
        question: "How do you currently prioritize tasks when you have multiple things to do?",
        answer: ""
      },
      {
        question: "What strategies have you tried for staying organized, and which ones worked best?",
        answer: ""
      },
      {
        question: "How do you handle interruptions or unexpected changes to your schedule?",
        answer: ""
      }
    ]
  }, {
    title: "Time Management and Executive Functioning",
    description: "This workbook focuses on developing practical time management skills and executive functioning strategies specifically designed for individuals with ADHD.",
    questions: [
      {
        question: "What are your biggest challenges with time management in your daily life?",
        answer: ""
      },
      {
        question: "Describe a typical morning routine. What works well and what doesn't?",
        answer: ""
      },
      {
        question: "How do you currently prioritize tasks when you have multiple things to do?",
        answer: ""
      },
      {
        question: "What strategies have you tried for staying organized, and which ones worked best?",
        answer: ""
      },
      {
        question: "How do you handle interruptions or unexpected changes to your schedule?",
        answer: ""
      }
    ]
  },

  // ADD MORE WORKBOOKS HERE - Copy the structure above
  // Template for easy adding:
  /*
  {
    title: "Your Workbook Title",
    description: "Description of what this workbook covers and its therapeutic purpose.",
    questions: [
      {
        question: "Your first question here?",
        answer: ""
      },
      {
        question: "Your second question here?",
        answer: ""
      },
      // Add more questions as needed
    ]
  },
  */
];

async function replaceWithOriginalWorkbooks() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Step 1: Get count of existing workbooks
    const existingCount = await Workbook.countDocuments();
    console.log(`📊 Found ${existingCount} existing workbooks in database`);

    // Step 2: Clear all existing TEMPLATE workbooks only (preserve user instances)
    console.log('🗑️  Clearing existing template workbooks...');
    const deleteResult = await Workbook.deleteMany({ 
      $or: [
        { isTemplate: true },
        { isTemplate: { $exists: false }, assignedTo: null } // Legacy templates
      ]
    });
    console.log(`✅ Cleared ${deleteResult.deletedCount} existing template workbooks`);

    // Step 3: Add original workbooks
    console.log(`📚 Adding ${originalWorkbooks.length} original workbooks...`);

    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < originalWorkbooks.length; i++) {
      const workbookData = originalWorkbooks[i];
      
      try {
        const newWorkbook = new Workbook({
          title: workbookData.title,
          description: workbookData.description,
          content: workbookData.content || "",
          questions: workbookData.questions || [],
          status: "assigned",
          isTemplate: true, // Mark as template
          assignedTo: null, // Templates are not assigned to anyone
          userResponse: "",
          adminFeedback: "",
          shareableLink: "",
        });

        await newWorkbook.save();
        successCount++;
        console.log(`✅ Added workbook ${i + 1}/${originalWorkbooks.length}: "${workbookData.title}"`);
        
      } catch (error) {
        errorCount++;
        console.error(`❌ Error adding workbook "${workbookData.title}":`, error.message);
      }
    }

    console.log('\n🎉 Replacement completed!');
    console.log(`🗑️  Cleared: ${deleteResult.deletedCount} demo workbooks`);
    console.log(`✅ Successfully added: ${successCount} original workbooks`);
    console.log(`❌ Errors: ${errorCount} workbooks`);
    console.log(`📊 Total new workbooks: ${successCount} workbooks`);

    // Verify final count
    const finalCount = await Workbook.countDocuments();
    console.log(`🔍 Final database count: ${finalCount} workbooks`);

  } catch (error) {
    console.error('💥 Database error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
    process.exit(0);
  }
}

// Run the replacement
console.log('🚀 Starting workbook replacement...');
console.log('⚠️  WARNING: This will DELETE all existing workbooks and replace them with original data');
console.log('📝 Make sure you have added your original workbooks to the "originalWorkbooks" array above');
console.log('');

replaceWithOriginalWorkbooks();
