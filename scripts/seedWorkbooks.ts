import mongoose, { Types } from "mongoose"; // Import Types directly
import connectMongo from "@/lib/mongoose"; // Adjust path as needed
import Workbook from "@/models/Workbook"; // Adjust path as needed

// JSON data (your provided JSON, truncated for brevity)
const jsonData = {
  success: true,
  data: {
    workbooks: [
      {
        _id: "64f8a1c9e8b7a2a1f3d90001",
        title: "Active Listening Skills (Communication)",
        description:
          "ADHD can impact listening in conversations due to impulsivity, distraction, or anxiety. This worksheet helps you reflect on how you listen and what makes it harder or easier to stay present.",
        link: "68a615e3e5b35d9336e7917c",
        questions: [
          {
            question:
              "Think of a recent conversation where you were trying to listen. What helped you stay focused?",
            _id: "68a615e7e5b35d9336e79188",
          },
          {
            question:
              "Were there moments when your attention drifted why do you think that happened?",
            _id: "68a615e7e5b35d9336e79189",
          },
          // ... add all questions for this workbook
        ],
        userName: "Unassigned",
        userEmail: "",
      },
      {
        _id: "64f8a1c9e8b7a2a1f3d90002",
        title: "ADHD and Communication Styles",
        description:
          "ADHD can influence how we communicate through impulsivity, rapid speech, tangents, or emotional intensity. This worksheet helps you reflect on how your communication style is shaped by ADHD.",
        link: "68a615e3e5b35d9336e7917d",
        questions: [
          {
            question:
              "Describe a recent conversation where you felt misunderstood or overwhelmed.",
            _id: "68a615e7e5b35d9336e79190",
          },
          // ... add all questions
        ],
        userName: "Unassigned",
        userEmail: "",
      },
      // ... add the rest of your workbooks (3–10)
    ],
  },
};

async function seedWorkbooks() {
  try {
    // Connect to MongoDB
    await connectMongo();
    console.log("Connected to MongoDB for seeding");

    // Extract workbooks
    const workbooks = jsonData.data.workbooks;
    const results = { added: 0, skipped: 0, errors: [] as string[] };

    for (const workbookData of workbooks) {
      try {
        // Check for existing workbook
        const existingWorkbook = await Workbook.findById(workbookData._id);
        if (existingWorkbook) {
          console.log(
            `Workbook with ID ${workbookData._id} already exists, skipping.`
          );
          results.skipped++;
          continue;
        }

        // Map JSON to schema
        const workbook = {
          _id: new Types.ObjectId(workbookData._id), // Use Types.ObjectId
          title: workbookData.title,
          description: workbookData.description,
          link: workbookData.link,
          questions: workbookData.questions.map((q) => ({
            question: q.question,
            answer: "", // Schema default
          })),
          status: "in_progress", // Schema default
          userResponse: "", // Schema default
          adminFeedback: "", // Schema default
          shareableLink: workbookData.link || "", // Use link or empty
          content: "", // Schema default
          // assignedTo: null, // "Unassigned" implies null
        };

        // Save new workbook
        const newWorkbook = new Workbook(workbook);
        await newWorkbook.save();
        console.log(`Seeded workbook: ${workbookData.title}`);
        results.added++;
      } catch (error: any) {
        console.error(
          `Error seeding workbook ${workbookData.title}:`,
          error.message
        );
        results.errors.push(
          `Failed to seed ${workbookData.title}: ${error.message}`
        );
      }
    }

    console.log(
      `Seeding complete: ${results.added} added, ${results.skipped} skipped`
    );
    if (results.errors.length > 0) {
      console.log("Errors:", results.errors);
    }
  } catch (error: any) {
    console.error("Seeding failed:", error.message);
  } finally {
    await mongoose.connection.close(); // Use mongoose.connection directly
    console.log("MongoDB connection closed.");
  }
}

// Run the script
seedWorkbooks()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
