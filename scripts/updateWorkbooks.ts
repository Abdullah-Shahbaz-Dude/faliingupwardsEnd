import mongoose, { Types, Document, Model } from "mongoose";
import connectMongo from "@/lib/mongoose"; // Path to your connectMongo
import WorkbookModel from "@/models/Workbook"; // Path to your Workbook model

// Define interfaces for JSON data
interface Question {
  _id: string;
  question: string;
}

interface WorkbookData {
  _id: string;
  title: string;
  description: string;
  link: string;
  questions: Question[];
  userName: string;
  userEmail: string;
}

interface JsonData {
  success: boolean;
  data: {
    workbooks: WorkbookData[];
  };
}

// Define Mongoose document interface
interface IWorkbook extends Document {
  _id: Types.ObjectId;
  title: string;
  description: string;
  link: string;
  questions: {
    _id: Types.ObjectId;
    question: string;
    answer: string;
  }[];
  status: string;
  userResponse: string;
  adminFeedback: string;
  shareableLink: string;
  content: string;
  assignedTo: Types.ObjectId | null;
}

// JSON data (hardcoded, or import from file)
const jsonData: JsonData = {
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
        ],
        userName: "Unassigned",
        userEmail: "",
      },
    ],
  },
};

async function updateWorkbooks() {
  try {
    // Connect to MongoDB WorkBooks database
    try {
      await connectMongo();
      console.log(
        "Connected to MongoDB WorkBooks database for updating workbooks"
      );
    } catch (error: unknown) {
      console.error("Failed to connect to MongoDB:", (error as Error).message);
      throw error;
    }

    // Extract workbooks from JSON
    const workbooks = jsonData.data.workbooks;
    const results: { updated: number; skipped: number; errors: string[] } = {
      updated: 0,
      skipped: 0,
      errors: [],
    };

    for (const workbookData of workbooks) {
      try {
        // Validate workbook _id
        if (!Types.ObjectId.isValid(workbookData._id)) {
          console.error(
            `Invalid ObjectId for workbook ${workbookData.title}: ${workbookData._id}`
          );
          results.errors.push(
            `Invalid ObjectId for ${workbookData.title}: ${workbookData._id}`
          );
          continue;
        }

        // Validate question _ids
        for (const q of workbookData.questions) {
          if (!Types.ObjectId.isValid(q._id)) {
            console.error(
              `Invalid question _id for workbook ${workbookData.title}: ${q._id}`
            );
            results.errors.push(
              `Invalid question _id for ${workbookData.title}: ${q._id}`
            );
            continue;
          }
        }

        // Find existing workbook by _id in workbooks collection
        const existingWorkbook = (await WorkbookModel.findById(
          workbookData._id
        )) as IWorkbook | null;
        if (!existingWorkbook) {
          console.log(
            `Workbook with ID ${workbookData._id} not found in workbooks collection, skipping.`
          );
          results.skipped++;
          continue;
        }

        // Prepare updated questions
        const updatedQuestions = workbookData.questions.map((q) => ({
          _id: new Types.ObjectId(q._id),
          question: q.question,
          answer:
            existingWorkbook.questions.find((eq) => eq._id.equals(q._id))
              ?.answer || "",
        }));

        // Update the workbook's questions
        existingWorkbook.questions = updatedQuestions;
        await existingWorkbook.save();

        console.log(`Updated workbook: ${workbookData.title}`);
        results.updated++;
      } catch (error: unknown) {
        console.error(
          `Error updating workbook ${workbookData.title}:`,
          (error as Error).message
        );
        results.errors.push(
          `Failed to update ${workbookData.title}: ${(error as Error).message}`
        );
      }
    }

    console.log({
      status: "Update complete",
      updated: results.updated,
      skipped: results.skipped,
      errors: results.errors,
    });
  } catch (error: unknown) {
    console.error("Update failed:", (error as Error).message);
    throw error;
  } finally {
    await mongoose.connection.close();
    console.log("MongoDB connection closed.");
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
}

// Run the script
updateWorkbooks()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
