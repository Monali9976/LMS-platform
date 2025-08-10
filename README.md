## Installation
Clone the repository:
git clone https://github.com/Monali9976/LMS-platform.git
cd LMS-platform

## Install dependencies:
npm install

## Start the server:
npm start

The API will run on: http://localhost:4000

## Usage:
- Use /api/upload-material to upload study PDFs.

- Use /api/submit-quiz to submit quiz answers and receive feedback.


## API Endpoints

### 1. Upload Study Material

- **URL:**
- POST http://localhost:4000/api/upload-material
- **Description:** Upload a PDF file containing course materials. The server processes the PDF and returns the number of chapters found.
- **Request:** Multipart/form-data with key `file` containing the PDF.

**response**
{
  "ok": true,
  "chapters": 5
}

- POST http://localhost:4000/api/submit-quiz
- Description: Submit answers to quiz questions. Receive score and feedback on weak areas.
- Request Body Example:
- {
  "answers": [
    {
      "question": "What pigment is used in photosynthesis?",
      "correctAnswer": "chlorophyll",
      "studentAnswer": "water"
    },
    {
      "question": "Where does the Calvin cycle occur?",
      "correctAnswer": "stroma",
      "studentAnswer": "stroma"
    }
  ]
}


**response**

{
    "score": 1,
    "total": 2,
    "weakAreas": [
        "Chapter 4: Photosynthesis  Photosynthesis is the process by which plants use sunlight to make food. The main pigment involved is chlorophyll."
    ],
    "recommendation": "You may need to revise: Chapter 4: Photosynthesis  Photosynthesis is the process by which plants use sunlight to make food. The main pigment involved is chlorophyll."
}
