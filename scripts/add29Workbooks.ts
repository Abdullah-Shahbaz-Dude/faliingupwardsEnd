import mongoose from 'mongoose';
import Workbook from '@/models/Workbook';
import connectMongo from '@/lib/mongoose';

// Your 29 workbooks data structure
const workbooksData = [
  {
    title: "Active Listening Skills (Communication)",
    description: "ADHD can impact listening in conversations due to impulsivity, distraction, or anxiety. This worksheet helps you reflect on how you listen and what makes it harder or easier to stay present.",
    questions: [
      {
        question: "Think of a recent conversation where you were trying to listen. What helped you stay focused?",
        answer: ""
      },
      {
        question: "Were there moments when your attention drifted? Why do you think that happened?",
        answer: ""
      },
      {
        question: "How do you know when someone feels heard by you?",
        answer: ""
      },
      {
        question: "What would you like to improve about your listening skills?",
        answer: ""
      }
    ]
  },
  {
    title: "ADHD and Communication Styles",
    description: "ADHD can influence how we communicate through impulsivity, rapid speech, tangents, or emotional intensity. This worksheet helps you reflect on how your communication style is shaped by ADHD.",
    questions: [
      {
        question: "Describe a recent conversation where you felt misunderstood or overwhelmed.",
        answer: ""
      },
      {
        question: "What communication patterns do you notice in yourself when you're stressed?",
        answer: ""
      },
      {
        question: "How do you typically handle disagreements or conflicts?",
        answer: ""
      },
      {
        question: "When do you feel most confident in your communication?",
        answer: ""
      }
    ]
  },
  {
    title: "Time Management and Planning",
    description: "Effective time management can be challenging with ADHD. This workbook helps you identify your time management challenges and develop personalized strategies.",
    questions: [
      {
        question: "What are your biggest time management challenges?",
        answer: ""
      },
      {
        question: "When during the day do you feel most productive?",
        answer: ""
      },
      {
        question: "How do you currently plan your daily tasks?",
        answer: ""
      },
      {
        question: "What happens when unexpected tasks come up?",
        answer: ""
      }
    ]
  },
  {
    title: "Executive Function Skills",
    description: "Executive functions include planning, organization, working memory, and cognitive flexibility. This workbook helps you understand and strengthen these skills.",
    questions: [
      {
        question: "Which executive function skills do you find most challenging?",
        answer: ""
      },
      {
        question: "How do you currently organize your personal space?",
        answer: ""
      },
      {
        question: "What strategies help you remember important information?",
        answer: ""
      },
      {
        question: "How do you adapt when plans change unexpectedly?",
        answer: ""
      }
    ]
  },
  {
    title: "Emotional Regulation and Self-Awareness",
    description: "ADHD can affect emotional regulation, leading to intense emotions or quick mood changes. This workbook helps you develop emotional awareness and coping strategies.",
    questions: [
      {
        question: "What emotions do you find most difficult to manage?",
        answer: ""
      },
      {
        question: "How do you typically recognize when you're becoming overwhelmed?",
        answer: ""
      },
      {
        question: "What calming strategies have you found effective?",
        answer: ""
      },
      {
        question: "How does your emotional state affect your daily activities?",
        answer: ""
      }
    ]
  },
  // ADD YOUR REMAINING 24 WORKBOOKS HERE
  // Follow the same pattern as above
  
  // TEMPLATE FOR EASY COPYING:
  /*
  {
    title: "Your Workbook Title",
    description: "Your comprehensive description of what this workbook covers and its purpose for ADHD management.",
    questions: [
      {
        question: "Your thoughtful question here?",
        answer: ""
      },
      {
        question: "Another reflective question?",
        answer: ""
      },
      {
        question: "A third question to explore?",
        answer: ""
      },
      {
        question: "Final question for this workbook?",
        answer: ""
      }
    ]
  },
  */
];

async function add29Workbooks() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await connectMongo();
    console.log('✅ Connected to MongoDB');

    console.log(`📚 Processing ${workbooksData.length} workbooks...`);

    const results = {
      added: 0,
      skipped: 0,
      errors: 0
    };

    for (let i = 0; i < workbooksData.length; i++) {
      const workbookData = workbooksData[i];
      
      try {
        // Check if workbook already exists
        const existingWorkbook = await Workbook.findOne({ title: workbookData.title });
        
        if (existingWorkbook) {
          console.log(`⚠️  Workbook "${workbookData.title}" already exists - skipping`);
          results.skipped++;
          continue;
        }

        // Create new workbook
        const newWorkbook = new Workbook({
          title: workbookData.title,
          description: workbookData.description,
          content: "",
          questions: workbookData.questions,
          status: "assigned",
          userResponse: "",
          adminFeedback: "",
          shareableLink: "",
        });

        await newWorkbook.save();
        results.added++;
        console.log(`✅ ${i + 1}/${workbooksData.length}: Added "${workbookData.title}"`);
        
      } catch (error: any) {
        results.errors++;
        console.error(`❌ Error adding "${workbookData.title}":`, error.message);
      }
    }

    console.log('\n🎉 Workbook import completed!');
    console.log(`✅ Successfully added: ${results.added} workbooks`);
    console.log(`⚠️  Skipped (already exist): ${results.skipped} workbooks`);
    console.log(`❌ Errors: ${results.errors} workbooks`);
    console.log(`📊 Total processed: ${workbooksData.length} workbooks`);

    if (results.added > 0) {
      console.log('\n🎯 Next steps:');
      console.log('1. Go to your admin dashboard');
      console.log('2. Navigate to the Workbooks section');
      console.log('3. Assign workbooks to users');
      console.log('4. Start managing your ADHD workbook collection!');
    }

  } catch (error: any) {
    console.error('💥 Database connection error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
    process.exit(0);
  }
}

// Run the import
add29Workbooks();
