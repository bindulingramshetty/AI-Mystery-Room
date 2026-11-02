# AI MYSTERY ROOM

## Complete Project Specification (SPEC.md)

**Project Name:** AI Mystery Room
**Project Type:** AI-Powered Interactive Mystery Investigation Web Application
**Version:** 1.0
**AI Provider:** Google Gemini
**Architecture:** MERN-inspired Full-Stack Architecture
**Development Approach:** Spec-Driven Development

---

# 1. PROJECT OVERVIEW

## 1.1 Introduction

AI Mystery Room is an interactive, AI-powered mystery investigation platform where users become detectives and solve mysteries generated dynamically using Google's Gemini AI.

Unlike traditional mystery games with predefined stories and fixed answers, AI Mystery Room generates unique mystery scenarios based on the user's chosen premise and difficulty level.

Players investigate crime scenes, examine suspects, discover hidden clues, request hints, analyze evidence, and identify the culprit.

The application provides an immersive detective experience with intelligent storytelling, interactive investigation mechanics, and a backend-controlled scoring system.

## 1.2 Problem Statement

Traditional mystery games frequently provide repetitive storylines, predetermined investigations, and limited interaction.

AI Mystery Room addresses these limitations by providing dynamically generated mysteries, interactive evidence discovery, adaptive difficulty, and AI-assisted storytelling.

## 1.3 Project Objectives

* Generate unique mysteries using Gemini AI.
* Allow users to customize their mystery premises.
* Provide three difficulty levels.
* Generate realistic suspects and interconnected clues.
* Support interactive investigation.
* Provide progressive hints.
* Allow users to submit accusations.
* Calculate scores securely on the backend.
* Reveal the complete solution only after an accusation.
* Provide an engaging and responsive user experience.

## 1.4 Target Audience

* Students.
* Mystery and detective enthusiasts.
* Casual gamers.
* Puzzle-solving enthusiasts.
* Users interested in interactive AI applications.

---

# 2. TECHNOLOGY STACK

## 2.1 Frontend

* React.js
* Vite
* JavaScript
* Tailwind CSS
* React Router DOM
* Axios
* Lucide React Icons

## 2.2 Backend

* Node.js
* Express.js
* JavaScript
* MongoDB
* Mongoose
* Google Gemini API using @google/genai
* Zod for validation

## 2.3 AI Integration

Google Gemini will generate:

* Mystery titles.
* Story descriptions.
* Crime scenarios.
* Suspect profiles.
* Clues.
* Hints.
* Correct solutions.
* Solution explanations.

All AI requests must originate from the backend.

## 2.4 Deployment

* Frontend: Vercel.
* Backend: Render or another suitable Node.js hosting provider.
* Database: MongoDB Atlas.
* Source Control: GitHub.

---

# 3. APPLICATION ARCHITECTURE

The application must follow a clean frontend-backend architecture.

Frontend:
React → Axios → Express API

Backend:
Express → Validation → Gemini API → MongoDB

Database:
MongoDB stores generated mysteries, investigation progress, and completed results.

The frontend must never communicate directly with Gemini using a secret API key.

The Gemini API key must remain exclusively in backend environment variables.

---

# 4. USER EXPERIENCE AND APPLICATION FLOW

The complete user journey must follow this sequence:

1. User visits the homepage.
2. User selects Start Investigation.
3. User enters a mystery premise.
4. User selects a difficulty level.
5. User clicks Generate Mystery.
6. The backend requests a structured mystery from Gemini.
7. The backend validates the generated response.
8. The mystery is saved in MongoDB.
9. The investigation room opens.
10. User examines suspects and discovers clues.
11. User requests hints when necessary.
12. User reviews the collected evidence.
13. User proceeds to the accusation screen.
14. User selects a suspect.
15. User submits the accusation.
16. Backend validates the accusation and calculates the score.
17. The solution and final verdict are revealed.
18. User can start another investigation.

---

# 5. PAGE SPECIFICATIONS

## 5.1 HOME PAGE

Purpose: Introduce the application and encourage users to begin an investigation.

Required elements:

* Application logo.
* Application name: AI MYSTERY ROOM.
* Navigation bar.
* Hero heading: "Every Mystery Has a Secret. Can You Find It?"
* Supporting description.
* Start Investigation button.
* How It Works section.
* Difficulty level previews.
* Feature highlights.
* Footer.

Design direction:

Create a cinematic detective-inspired interface.

Use:

* Dark backgrounds.
* Deep navy and charcoal.
* Gold accents.
* Subtle gradients.
* Elegant typography.
* Crime-investigation-inspired visual elements.

The homepage must look sophisticated rather than childish.

## 5.2 CREATE MYSTERY PAGE

Purpose: Allow users to customize their investigation.

Required elements:

1. Page heading: Create Your Mystery.
2. Mystery premise input.
3. Character limit indicator.
4. Three difficulty selection cards.
5. Difficulty descriptions.
6. Generate Mystery button.
7. Back navigation.

Difficulty descriptions:

EASY:

* Beginner-friendly.
* Straightforward investigation.
* Clearly connected clues.

MEDIUM:

* Moderate complexity.
* More suspects.
* Multiple evidence connections.

HARD:

* Complex investigation.
* More suspects.
* Subtle clues.
* Requires deeper reasoning.

Validation:

* Premise cannot be empty.
* Maximum premise length: 500 characters.
* Difficulty must be selected.
* Prevent duplicate submissions while generation is running.

Loading state:

Display an engaging investigation animation with messages such as:

* Constructing the mystery...
* Identifying suspects...
* Planting evidence...
* Connecting hidden clues...

## 5.3 INVESTIGATION ROOM

This is the primary gameplay screen.

Required sections:

### A. Mystery Header

Display:

* Mystery title.
* Difficulty.
* Investigation status.
* Progress indicator.

### B. Mystery Story

Display the generated mystery introduction.

The story should explain:

* What happened.
* Where it happened.
* When it happened.
* Important background information.

Do not reveal the culprit.

### C. Suspect Profiles

Display suspect cards containing:

* Name.
* Photograph or generated avatar.
* Age.
* Occupation.
* Relationship with the victim.
* Motive.
* Alibi.
* Personality description.

Each suspect should have a detailed profile.

Suspect information must not directly reveal the culprit.

### D. Evidence and Clues

Display clues as interactive evidence cards.

Each card should contain:

* Evidence number.
* Evidence title.
* Short locked-state description.
* Discovery status.
* Discover button.

When a player discovers a clue, reveal:

* Full evidence description.
* Relevant observations.
* Possible connections.

Display discovered clues separately from undiscovered clues.

### E. Investigation Progress

Display:

* Total clues.
* Discovered clues.
* Remaining clues.
* Hints used.
* Investigation progress.

### F. Hint System

Provide a Request Hint button.

Hints must be progressive and should guide the player without directly revealing the culprit.

Display hints one at a time.

### G. Navigation

Include:

* Home.
* Suspects.
* Evidence.
* Hints.
* Accuse Suspect.

The accusation option should be accessible without forcing players to discover every clue.

## 5.4 ACCUSATION PAGE

Purpose: Allow players to identify the suspected culprit.

Required elements:

* Investigation title.
* Accusation heading.
* Suspect selection cards.
* Selected suspect indicator.
* Confirmation dialog.
* Submit Accusation button.

Before submission, display:

"Are you confident about your investigation? Once submitted, your accusation cannot be changed."

After confirmation, send the accusation to the backend.

Prevent multiple accusations for the same investigation.

## 5.5 RESULTS PAGE

Display the completed investigation report.

Required elements:

* Correct or incorrect verdict.
* Correct culprit.
* Player's accusation.
* Final score.
* Difficulty level.
* Number of clues discovered.
* Number of hints used.
* Complete explanation.
* Important evidence connections.
* Why the culprit committed the crime.
* How the mystery was solved.

Display a success animation for correct accusations.

Display a suitable alternative animation for incorrect accusations.

Include:

* Play Again.
* Create Another Mystery.
* Return Home.

The complete solution must only be available after the accusation has been submitted successfully.

---

# 6. DIFFICULTY SYSTEM

The application must support exactly three initial difficulty levels.

| Difficulty | Suspects | Clues | Hints |
| ---------- | -------: | ----: | ----: |
| Easy       |        3 |     5 |     2 |
| Medium     |        4 |     7 |     3 |
| Hard       |        5 |     9 |     3 |

Gemini must generate exactly the specified number of suspects, clues, and hints.

Difficulty must influence the logical complexity of the mystery.

Easy:

* Direct evidence.
* Simple motives.
* Easily distinguishable suspect information.

Medium:

* Interconnected evidence.
* Some misleading information.
* More detailed reasoning.

Hard:

* Subtle evidence.
* Complex alibis.
* Multiple possible interpretations.
* Requires connecting several clues.

The solution must remain logically defensible at every difficulty level.

---

# 7. GEMINI AI GENERATION SPECIFICATION

## 7.1 Generation Requirements

Gemini must generate a complete mystery using the user's premise and selected difficulty.

The generated mystery must include:

* Unique title.
* Story.
* Crime scene.
* Victim details.
* Suspects.
* Suspect motives.
* Suspect alibis.
* Clues.
* Progressive hints.
* Correct culprit.
* Explanation.
* Evidence-based solution.

## 7.2 Expected AI Output Structure

Gemini must return structured JSON.

Example structure:

{
"title": "The Midnight Gallery Mystery",
"difficulty": "easy",
"story": "A valuable painting disappeared from a private gallery during an evening exhibition.",
"crimeScene": {
"location": "Private Art Gallery",
"time": "10:30 PM",
"incident": "The disappearance of a valuable painting"
},
"victim": {
"name": "Arthur Blake",
"description": "Gallery owner"
},
"suspects": [
{
"id": "S1",
"name": "Daniel",
"age": 32,
"occupation": "Assistant Curator",
"motive": "Financial difficulties",
"alibi": "Claims to have been in the storage room",
"description": "A reserved employee"
}
],
"clues": [
{
"id": "C1",
"title": "Broken Glass",
"description": "Small pieces of glass were found near the gallery entrance.",
"importance": "high",
"relatedSuspects": ["S1"]
}
],
"hints": [
"Examine the timeline carefully.",
"Consider whether the alibis are consistent."
],
"solution": {
"culpritId": "S1",
"motive": "The suspect needed money.",
"explanation": "The evidence establishes the suspect's involvement.",
"evidenceConnections": [
"The timeline contradicts the suspect's alibi."
]
}
}

This is an illustrative structure. Actual generated mysteries must contain the exact number of suspects, clues, and hints required by the selected difficulty.

## 7.3 AI Validation

Use Zod to validate all Gemini responses.

Validation requirements:

* Valid JSON.
* All required fields present.
* Correct difficulty.
* Exact suspect count.
* Exact clue count.
* Exact hint count.
* Unique suspect IDs.
* Unique clue IDs.
* Valid culprit ID.
* Non-empty explanations.
* Valid evidence references.

If Gemini returns invalid information:

1. Attempt a controlled repair or regeneration.
2. Validate again.
3. If validation still fails, return a meaningful error.
4. Never save an invalid mystery.

## 7.4 Logical Consistency

Every generated mystery must have:

* One clearly identifiable culprit.
* A plausible motive.
* A coherent timeline.
* Consistent suspect information.
* Evidence supporting the solution.
* No unavoidable contradictions.
* Enough information to identify the culprit.

Misleading clues are permitted, but the final solution must be supported by discoverable evidence.

---

# 8. SCORING SYSTEM

All scoring calculations must happen on the backend.

Base accusation score:

| Difficulty | Correct Accusation |
| ---------- | -----------------: |
| Easy       |                100 |
| Medium     |                150 |
| Hard       |                200 |

Additional points:

* Each discovered clue: +5 points.
* Each hint used: -10 points.

Formula:

Final Score = Base Score + Discovered Clues × 5 - Hints Used × 10

Rules:

* Incorrect accusation: 0 points.
* Minimum score: 0.
* Maximum score: Base Score + all available clue points.
* Scores must be calculated using actual backend records.
* Never trust score values submitted by the frontend.

Examples:

Easy:
100 + (5 × 5) - (1 × 10) = 115 points.

Medium:
150 + (7 × 5) - (2 × 10) = 165 points.

Hard:
200 + (9 × 5) - (3 × 10) = 215 points.

---

# 9. BACKEND API SPECIFICATION

Base URL:

`/api`

## 9.1 Generate Mystery

POST `/api/cases`

Request:

{
"premise": "A valuable painting disappears during an exhibition.",
"difficulty": "easy"
}

Response:

{
"success": true,
"caseId": "CASE_ID",
"message": "Mystery generated successfully"
}

The response must not contain the solution.

## 9.2 Retrieve Mystery

GET `/api/cases/:id`

Return:

* Mystery title.
* Story.
* Crime scene.
* Victim details.
* Suspects.
* Public clue information.
* Difficulty.
* Player progress.

Never return the culprit or solution.

## 9.3 Discover Clue

POST `/api/cases/:id/clues/:clueId/discover`

Response:

{
"success": true,
"clue": {
"id": "C1",
"title": "Broken Glass",
"description": "Evidence description"
}
}

Prevent duplicate clue discoveries.

## 9.4 Request Hint

POST `/api/cases/:id/hints`

Response:

{
"success": true,
"hintNumber": 1,
"hint": "Examine the timeline carefully."
}

Prevent requesting more hints than the difficulty allows.

## 9.5 Submit Accusation

POST `/api/cases/:id/accuse`

Request:

{
"suspectId": "S1"
}

Response:

{
"success": true,
"correct": true,
"result": {
"culprit": "Daniel",
"explanation": "Complete solution explanation",
"motive": "Financial difficulties",
"score": 115
}
}

The result must only be returned after a valid accusation.

## 9.6 Retrieve Completed Result

GET `/api/cases/:id/result`

Return the completed investigation report only if the case has been completed.

Return an appropriate error if the investigation is still active.

## 9.7 Error Handling

Use consistent error responses.

Example:

{
"success": false,
"message": "Unable to generate mystery. Please try again."
}

Handle:

* Invalid input.
* Missing cases.
* Invalid suspect IDs.
* Invalid clue IDs.
* Duplicate discoveries.
* Excessive hint requests.
* Duplicate accusations.
* Gemini API failures.
* MongoDB connection failures.
* Server errors.

Use appropriate HTTP status codes.

---

# 10. DATABASE DESIGN

Use MongoDB and Mongoose.

Create a Mystery schema.

Required fields:

* title
* premise
* difficulty
* story
* crimeScene
* victim
* suspects
* clues
* hints
* solution
* discoveredClues
* hintsUsed
* accusation
* score
* status
* createdAt
* updatedAt

## 10.1 Mystery Status

Possible values:

* generating
* active
* completed
* failed

## 10.2 Investigation Progress

Store:

* Discovered clue IDs.
* Number of hints requested.
* Accused suspect ID.
* Accusation correctness.
* Final score.
* Completion timestamp.

## 10.3 Solution Privacy

The solution must be stored securely in MongoDB.

Never include the solution in:

* Public mystery API responses.
* Frontend application state before completion.
* Browser local storage.
* HTML attributes.
* Public API error messages.
* Frontend JavaScript bundles.

Only backend controllers should access the private solution.

For the initial version, each generated case can be treated as a unique single-player investigation identified by its case ID.

---

# 11. SECURITY REQUIREMENTS

Implement the following:

1. Store Gemini API keys in backend `.env`.
2. Never expose secret keys in React.
3. Add CORS restrictions.
4. Validate incoming requests using Zod.
5. Sanitize user-provided premise text.
6. Add reasonable request-size limits.
7. Add rate limiting to AI generation and hint endpoints.
8. Prevent duplicate accusations.
9. Calculate scores on the backend.
10. Never expose the culprit before an accusation.
11. Avoid returning database documents directly.
12. Keep production environment variables separate from development variables.

Use `.gitignore` to exclude:

* `.env`
* `node_modules`
* Build output.
* Local configuration files.

Provide `.env.example` containing placeholder values only.

---

# 12. FRONTEND DESIGN REQUIREMENTS

## 12.1 Visual Identity

The interface must feel like entering a modern detective investigation room.

Design inspiration:

* Cinematic detective environments.
* Mystery investigation dashboards.
* Evidence boards.
* Dark editorial interfaces.

Suggested colors:

* Background: #0B1020
* Secondary Background: #151C2E
* Card Background: #1B2438
* Gold Accent: #D6AD60
* Primary Text: #F4F1E8
* Secondary Text: #A5AEC0
* Success: #38B980
* Error: #E46B6B

## 12.2 Typography

Use sophisticated, readable typography.

Suggested combinations:

* Playfair Display for major headings.
* Inter for general interface text.

## 12.3 UI Components

Create reusable components:

* Navbar
* Footer
* Button
* Input
* DifficultyCard
* SuspectCard
* ClueCard
* HintPanel
* ProgressBar
* LoadingScreen
* ConfirmationModal
* ResultCard
* ErrorMessage

## 12.4 Responsive Design

The application must work on:

* Desktop.
* Laptop.
* Tablet.
* Mobile.

Avoid horizontal overflow.

Use responsive grids and flexible layouts.

## 12.5 Animations

Include subtle animations for:

* Page transitions.
* Card interactions.
* Clue discovery.
* Investigation progress.
* Hint reveal.
* Final verdict.

Animations must not interfere with usability.

---

# 13. FRONTEND PROJECT STRUCTURE

Suggested structure:

client/
src/
assets/
components/
Navbar.jsx
Footer.jsx
Button.jsx
SuspectCard.jsx
ClueCard.jsx
HintPanel.jsx
LoadingScreen.jsx
ProgressBar.jsx
pages/
Home.jsx
CreateMystery.jsx
InvestigationRoom.jsx
Accusation.jsx
Results.jsx
services/
api.js
hooks/
utils/
App.jsx
main.jsx
index.css

public/
package.json
vite.config.js

---

# 14. BACKEND PROJECT STRUCTURE

server/
config/
database.js

controllers/
caseController.js

models/
Mystery.js

routes/
caseRoutes.js

services/
geminiService.js

middleware/
errorMiddleware.js

validators/
caseValidator.js

utils/
scoring.js

server.js
package.json
.env
.env.example

Keep business logic separate from routes and controllers.

---

# 15. ENVIRONMENT VARIABLES

Backend `.env`:

PORT=5000

MONGODB_URI=your_mongodb_connection_string

GEMINI_API_KEY=your_gemini_api_key

CLIENT_URL=http://localhost:5173

Frontend environment:

VITE_API_URL=http://localhost:5000/api

Never put GEMINI_API_KEY in the frontend environment.

---

# 16. TESTING REQUIREMENTS

Test all major functionality.

## Home Page

* Homepage loads.
* Navigation works.
* Start button opens the creation page.

## Mystery Generation

* Empty premise is rejected.
* Missing difficulty is rejected.
* All three difficulties generate mysteries.
* Correct suspect counts are maintained.
* Correct clue counts are maintained.
* Correct hint counts are maintained.

## Investigation

* Suspect information displays correctly.
* Clues can be discovered.
* Duplicate discoveries are prevented.
* Hints can be requested.
* Hint limits are enforced.
* Progress updates correctly.

## Accusation

* Valid suspect IDs are accepted.
* Invalid suspect IDs are rejected.
* Duplicate accusations are prevented.
* Correct and incorrect accusations work.

## Scoring

* Base scores are correct.
* Clue points are correct.
* Hint penalties are correct.
* Incorrect accusations receive zero.
* Minimum score is zero.

## Security

* Solution is not exposed before accusation.
* API keys are not exposed.
* Frontend cannot manipulate scores.
* Completed results are accessible only after accusation.

## Deployment

* Frontend loads from its production URL.
* Backend responds correctly.
* MongoDB connects.
* Gemini integration works.
* Complete gameplay works on the deployed website.

---

# 17. ACCEPTANCE CRITERIA

The project is considered complete when:

1. The homepage works.
2. Users can create mysteries.
3. Easy, Medium, and Hard difficulties work.
4. Gemini generates structured mysteries.
5. AI responses are validated.
6. The correct number of suspects, clues, and hints is maintained.
7. Players can investigate suspects.
8. Players can discover clues.
9. Players can request hints.
10. Players can submit accusations.
11. Correct and incorrect verdicts work.
12. Backend scoring works accurately.
13. Solutions remain private until accusation.
14. Results display complete explanations.
15. Users can start new investigations.
16. The website is responsive.
17. The backend and database work in production.
18. The complete application works on its deployed URL.

---

# 18. DEVELOPMENT PHASES

Development must be incremental.

PHASE 1: Environment Setup

* Configure frontend.
* Configure backend.
* Install dependencies.
* Connect MongoDB.

PHASE 2: Backend Development

* Create schemas.
* Implement routes.
* Implement controllers.
* Configure validation.
* Integrate Gemini.

PHASE 3: Frontend Development

* Build homepage.
* Build creation page.
* Build investigation room.
* Build accusation page.
* Build results page.

PHASE 4: Gameplay Integration

* Connect APIs.
* Implement clue discovery.
* Implement hints.
* Implement accusation.
* Implement scoring.

PHASE 5: Testing

* Test all difficulty levels.
* Test API responses.
* Test security.
* Fix bugs.
* Test responsive layouts.

PHASE 6: Deployment

* Deploy backend.
* Configure MongoDB Atlas.
* Configure production environment variables.
* Deploy frontend to Vercel.
* Test production gameplay.

PHASE 7: Final Submission

* Push complete source code to GitHub.
* Verify public repository access.
* Verify live website.
* Create and solve a mystery.
* Submit GitHub repository and deployed website URL.

---

# 19. FUTURE ENHANCEMENTS

These features are optional and must not delay the required application.

Possible enhancements:

* Detective leaderboard.
* Investigation history.
* Player profiles.
* Daily mystery challenges.
* Achievement badges.
* Mystery sharing.
* Additional story themes.
* Sound effects.
* Investigation timer.
* Multiplayer investigation mode.

Prioritize a complete, reliable single-player experience before implementing enhancements.

---

# 20. FINAL DEVELOPMENT INSTRUCTION

Build AI Mystery Room according to this specification.

Important development rules:

1. Read this entire specification before writing code.
2. Follow the defined architecture.
3. Build one phase at a time.
4. Do not skip required features.
5. Do not use mock data as a replacement for working Gemini integration in the final application.
6. Keep all secrets on the backend.
7. Never expose the mystery solution prematurely.
8. Validate all AI-generated data.
9. Implement scoring on the backend.
10. Test every major feature before proceeding.
11. Keep the code clean, modular, and maintainable.
12. Provide clear instructions whenever a manual configuration is required.
13. Do not claim a feature is complete unless it has been implemented and tested.
14. Prioritize functional correctness, security, and a polished user experience.

**FINAL OBJECTIVE:**

Deliver a fully functional, AI-powered mystery investigation web application with dynamic Gemini-generated mysteries, interactive investigations, progressive hints, secure accusation handling, backend-controlled scoring, and successful production deployment.

The final application must provide a complete experience from mystery creation to final verdict.
