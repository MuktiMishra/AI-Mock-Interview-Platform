import Session  from "../models/session.model.js";
import Question from "../models/question.model.js";

// ── Static question bank ───────────────────────────────────────────────────
// Looks like AI output. Served in order per section.

const STATIC_QUESTIONS = {
  aptitude: [
    {
      text: "A train travels 60 km in 45 minutes. What is its speed in km/h?",
      options: ["A. 72 km/h", "B. 80 km/h", "C. 90 km/h", "D. 75 km/h"],
      correctAnswer: "B",
      tags: ["speed", "time", "distance"],
      expectedKeywords: [],
      rubric: { points: 10, notes: "60 ÷ 0.75 = 80 km/h" },
    },
    {
      text: "If 8 workers complete a job in 12 days, how many days will 6 workers take?",
      options: ["A. 14 days", "B. 15 days", "C. 16 days", "D. 18 days"],
      correctAnswer: "C",
      tags: ["work", "time", "men"],
      expectedKeywords: [],
      rubric: { points: 10, notes: "8×12 ÷ 6 = 16 days" },
    },
    {
      text: "What is the next number in the series: 2, 6, 12, 20, 30, ?",
      options: ["A. 40", "B. 42", "C. 44", "D. 38"],
      correctAnswer: "B",
      tags: ["series", "pattern"],
      expectedKeywords: [],
      rubric: { points: 10, notes: "n(n+1): 6×7 = 42" },
    },
    {
      text: "A shopkeeper sells an item at 20% profit. If the cost price is ₹500, what is the selling price?",
      options: ["A. ₹550", "B. ₹580", "C. ₹600", "D. ₹620"],
      correctAnswer: "C",
      tags: ["profit", "percentage"],
      expectedKeywords: [],
      rubric: { points: 10, notes: "500 × 1.2 = 600" },
    },
    {
      text: "Find the odd one out: 121, 144, 169, 196, 225, 250",
      options: ["A. 196", "B. 225", "C. 250", "D. 169"],
      correctAnswer: "C",
      tags: ["odd one out", "squares"],
      expectedKeywords: [],
      rubric: { points: 10, notes: "250 is not a perfect square" },
    },
    {
      text: "If P is 25% more than Q, then Q is what percent less than P?",
      options: ["A. 20%", "B. 25%", "C. 15%", "D. 22%"],
      correctAnswer: "A",
      tags: ["percentage", "comparison"],
      expectedKeywords: [],
      rubric: { points: 10, notes: "25/125 × 100 = 20%" },
    },
    {
      text: "Two pipes A and B can fill a tank in 20 and 30 minutes respectively. If both are opened together, how long to fill the tank?",
      options: ["A. 10 min", "B. 12 min", "C. 15 min", "D. 8 min"],
      correctAnswer: "B",
      tags: ["pipes", "work"],
      expectedKeywords: [],
      rubric: { points: 10, notes: "1/(1/20+1/30) = 12 min" },
    },
    {
      text: "The average of 5 numbers is 30. If one number is excluded the average becomes 28. What is the excluded number?",
      options: ["A. 36", "B. 38", "C. 40", "D. 42"],
      correctAnswer: "B",
      tags: ["average"],
      expectedKeywords: [],
      rubric: { points: 10, notes: "5×30 − 4×28 = 150−112 = 38" },
    },
    {
      text: "In how many ways can the letters of the word LEVEL be arranged?",
      options: ["A. 30", "B. 40", "C. 60", "D. 20"],
      correctAnswer: "A",
      tags: ["permutation", "arrangement"],
      expectedKeywords: [],
      rubric: { points: 10, notes: "5!/(2!×2!) = 30" },
    },
    {
      text: "A clock shows 3:15. What is the angle between the hour and minute hands?",
      options: ["A. 0°", "B. 7.5°", "C. 15°", "D. 22.5°"],
      correctAnswer: "B",
      tags: ["clocks", "angles"],
      expectedKeywords: [],
      rubric: { points: 10, notes: "Hour hand at 97.5°, minute at 90°, diff = 7.5°" },
    },
  ],

  technical1: [
    {
      text: "What is the difference between SQL and NoSQL databases? When would you choose one over the other?",
      options: [],
      correctAnswer: null,
      tags: ["databases", "SQL", "NoSQL"],
      expectedKeywords: ["SQL", "NoSQL", "relational", "schema", "scalability"],
      rubric: { points: 10, notes: "Should mention relational vs document model, use cases" },
    },
    {
      text: "Explain REST API design principles. What makes an API truly RESTful?",
      options: [],
      correctAnswer: null,
      tags: ["API", "REST", "HTTP"],
      expectedKeywords: ["stateless", "HTTP methods", "resources", "JSON", "status codes"],
      rubric: { points: 10, notes: "Cover statelessness, uniform interface, HTTP verbs" },
    },
    {
      text: "What is middleware in Express.js and how does the request-response cycle work?",
      options: [],
      correctAnswer: null,
      tags: ["Express", "middleware", "Node.js"],
      expectedKeywords: ["req", "res", "next", "pipeline", "authentication"],
      rubric: { points: 10, notes: "Should explain next(), chaining, use cases like auth/logging" },
    },
    {
      text: "Explain the concept of indexing in databases. What are its trade-offs?",
      options: [],
      correctAnswer: null,
      tags: ["indexing", "performance", "database"],
      expectedKeywords: ["index", "query speed", "write overhead", "B-tree"],
      rubric: { points: 10, notes: "Faster reads vs slower writes, storage overhead" },
    },
    {
      text: "What is the event loop in Node.js and how does it handle asynchronous operations?",
      options: [],
      correctAnswer: null,
      tags: ["Node.js", "event loop", "async"],
      expectedKeywords: ["event loop", "callback queue", "non-blocking", "single thread"],
      rubric: { points: 10, notes: "Explain call stack, task queue, microtasks" },
    },
    {
      text: "What are the differences between authentication and authorisation? How would you implement JWT authentication?",
      options: [],
      correctAnswer: null,
      tags: ["auth", "JWT", "security"],
      expectedKeywords: ["authentication", "authorisation", "JWT", "token", "secret"],
      rubric: { points: 10, notes: "Auth = who you are, authz = what you can do" },
    },
    {
      text: "Explain the MVC design pattern with a real example.",
      options: [],
      correctAnswer: null,
      tags: ["MVC", "design pattern", "architecture"],
      expectedKeywords: ["model", "view", "controller", "separation of concerns"],
      rubric: { points: 10, notes: "Clear separation, give a concrete example" },
    },
    {
      text: "What is the difference between process and thread? How does Node.js handle concurrency?",
      options: [],
      correctAnswer: null,
      tags: ["process", "thread", "concurrency"],
      expectedKeywords: ["process", "thread", "single threaded", "worker threads"],
      rubric: { points: 10, notes: "Node is single-threaded but non-blocking via event loop" },
    },
    {
      text: "How does HTTPS work? Explain the TLS handshake at a high level.",
      options: [],
      correctAnswer: null,
      tags: ["HTTPS", "TLS", "security"],
      expectedKeywords: ["TLS", "certificate", "encryption", "handshake", "symmetric key"],
      rubric: { points: 10, notes: "Asymmetric key exchange, then symmetric encryption" },
    },
    {
      text: "What is database normalisation? Explain 1NF, 2NF, and 3NF.",
      options: [],
      correctAnswer: null,
      tags: ["normalisation", "database design"],
      expectedKeywords: ["1NF", "2NF", "3NF", "redundancy", "dependency"],
      rubric: { points: 10, notes: "Each NF builds on previous, eliminates redundancy" },
    },
  ],

  technical2: [
    {
      text: "Your resume mentions Node.js and MongoDB. How did you handle schema validation before saving data to the database?",
      options: [],
      correctAnswer: null,
      tags: ["Mongoose", "schema", "validation"],
      expectedKeywords: ["Mongoose", "schema", "required", "validation", "error handling"],
      rubric: { points: 10, notes: "Should mention Mongoose validators, required fields, error handling" },
    },
    {
      text: "You listed JWT authentication in your project. What happens if a JWT token is stolen and how would you mitigate that?",
      options: [],
      correctAnswer: null,
      tags: ["JWT", "security", "tokens"],
      expectedKeywords: ["expiry", "httpOnly", "refresh token", "blacklist", "XSS"],
      rubric: { points: 10, notes: "Short expiry, httpOnly cookies, refresh token rotation" },
    },
    {
      text: "Walk me through the data flow in your project when a user submits a voice answer — from the browser to the score being stored.",
      options: [],
      correctAnswer: null,
      tags: ["architecture", "data flow", "system design"],
      expectedKeywords: ["FormData", "multipart", "Gemini", "transcription", "score", "MongoDB"],
      rubric: { points: 10, notes: "Browser → Express → Gemini transcribe → score → Answer.create()" },
    },
    {
      text: "Your project uses Gemini API for question generation. What prompt engineering techniques did you apply to ensure question quality?",
      options: [],
      correctAnswer: null,
      tags: ["Gemini", "prompt engineering", "AI"],
      expectedKeywords: ["prompt", "JSON", "context", "previous questions", "rubric"],
      rubric: { points: 10, notes: "Role prompting, structured output, deduplication via previousQuestions" },
    },
    {
      text: "How did you design the Drive model to support 4 independent rounds, each with its own session and score?",
      options: [],
      correctAnswer: null,
      tags: ["MongoDB", "schema design", "Drive"],
      expectedKeywords: ["rounds", "sessionId", "subdocument", "populate", "avgScore"],
      rubric: { points: 10, notes: "rounds[] subdocument, each with sessionId reference and status" },
    },
    {
      text: "Explain how you prevented duplicate questions from appearing in the same session.",
      options: [],
      correctAnswer: null,
      tags: ["deduplication", "prompt", "session"],
      expectedKeywords: ["previousQuestions", "prompt", "questionIds", "session"],
      rubric: { points: 10, notes: "Fetch all question texts from session, inject into AI prompt" },
    },
    {
      text: "Your resume mentions React on the frontend. How did you manage state across the interview session — timer, recording, question, score?",
      options: [],
      correctAnswer: null,
      tags: ["React", "state management", "useState"],
      expectedKeywords: ["useState", "useRef", "useEffect", "MediaRecorder", "timer"],
      rubric: { points: 10, notes: "Multiple useState, useRef for MediaRecorder and timer, useEffect cleanup" },
    },
    {
      text: "How did you handle the case where the user's microphone permission is denied in the browser?",
      options: [],
      correctAnswer: null,
      tags: ["browser API", "permissions", "error handling"],
      expectedKeywords: ["getUserMedia", "try catch", "error", "permission", "fallback"],
      rubric: { points: 10, notes: "try/catch around getUserMedia, user-facing error message" },
    },
    {
      text: "Describe the scoring algorithm you used. How does the Gemini prompt ensure scores are consistent and not random?",
      options: [],
      correctAnswer: null,
      tags: ["scoring", "Gemini", "consistency"],
      expectedKeywords: ["rubric", "prompt", "range", "integer", "evaluation"],
      rubric: { points: 10, notes: "Structured prompt with score bands, strict integer output rule" },
    },
    {
      text: "If you were to scale this application to 10,000 concurrent users, what would you change first?",
      options: [],
      correctAnswer: null,
      tags: ["scalability", "system design", "architecture"],
      expectedKeywords: ["load balancer", "queue", "Redis", "horizontal scaling", "rate limit"],
      rubric: { points: 10, notes: "Answer queue (Bull/Redis), horizontal Node scaling, DB indexing" },
    },
  ],

  hr: [
    {
      text: "Tell me about yourself and what led you to pursue software development.",
      options: [],
      correctAnswer: null,
      tags: ["introduction", "background"],
      expectedKeywords: ["passion", "project", "learning", "goal"],
      rubric: { points: 10, notes: "Structured: background, interest, project, future" },
    },
    {
      text: "Describe a time you worked in a team and faced a conflict. How did you resolve it?",
      options: [],
      correctAnswer: null,
      tags: ["teamwork", "conflict resolution"],
      expectedKeywords: ["communication", "listen", "compromise", "outcome"],
      rubric: { points: 10, notes: "STAR format, positive resolution, learning" },
    },
    {
      text: "What is your greatest technical weakness and how are you working to improve it?",
      options: [],
      correctAnswer: null,
      tags: ["self-awareness", "growth"],
      expectedKeywords: ["weakness", "learning", "improving", "resources"],
      rubric: { points: 10, notes: "Honest weakness + concrete improvement plan" },
    },
    {
      text: "Where do you see yourself in 3 years?",
      options: [],
      correctAnswer: null,
      tags: ["career goals", "ambition"],
      expectedKeywords: ["growth", "skills", "contribute", "role"],
      rubric: { points: 10, notes: "Realistic, ambitious, aligned with company" },
    },
    {
      text: "Why should we hire you over other candidates?",
      options: [],
      correctAnswer: null,
      tags: ["value proposition", "confidence"],
      expectedKeywords: ["skills", "project", "learning", "unique"],
      rubric: { points: 10, notes: "Specific differentiators, not generic answers" },
    },
    {
      text: "How do you handle tight deadlines and pressure? Give a specific example.",
      options: [],
      correctAnswer: null,
      tags: ["pressure", "time management"],
      expectedKeywords: ["prioritise", "deadline", "calm", "delivered"],
      rubric: { points: 10, notes: "STAR format, concrete outcome" },
    },
    {
      text: "Tell me about a project you are most proud of and why.",
      options: [],
      correctAnswer: null,
      tags: ["project", "pride", "achievement"],
      expectedKeywords: ["built", "challenge", "learned", "impact"],
      rubric: { points: 10, notes: "Technical depth + personal growth + impact" },
    },
    {
      text: "How do you stay updated with the latest technologies in your field?",
      options: [],
      correctAnswer: null,
      tags: ["learning", "growth mindset"],
      expectedKeywords: ["blogs", "GitHub", "courses", "community"],
      rubric: { points: 10, notes: "Specific sources, not just 'I Google things'" },
    },
    {
      text: "Describe your ideal work environment and team culture.",
      options: [],
      correctAnswer: null,
      tags: ["culture fit", "work style"],
      expectedKeywords: ["collaborative", "feedback", "growth", "autonomy"],
      rubric: { points: 10, notes: "Matches company values, shows self-awareness" },
    },
    {
      text: "Do you have any questions for us?",
      options: [],
      correctAnswer: null,
      tags: ["engagement", "curiosity"],
      expectedKeywords: ["team", "growth", "product", "culture"],
      rubric: { points: 10, notes: "Shows genuine interest, not 'No I'm good'" },
    },
  ],

  coding: [
    {
      text: "Write a function to reverse a string without using built-in reverse methods. Explain your approach.",
      options: [],
      correctAnswer: null,
      tags: ["string", "algorithm"],
      expectedKeywords: ["loop", "index", "swap", "two pointer"],
      rubric: { points: 10, notes: "Two-pointer or loop, explain time complexity" },
    },
    {
      text: "Given an array of integers, find two numbers that add up to a target sum. What is the optimal time complexity?",
      options: [],
      correctAnswer: null,
      tags: ["array", "hash map", "two sum"],
      expectedKeywords: ["hash map", "O(n)", "complement", "lookup"],
      rubric: { points: 10, notes: "HashMap approach is O(n), brute force O(n²)" },
    },
    {
      text: "Explain the difference between a stack and a queue. When would you use each?",
      options: [],
      correctAnswer: null,
      tags: ["data structures", "stack", "queue"],
      expectedKeywords: ["LIFO", "FIFO", "stack", "queue", "undo", "BFS"],
      rubric: { points: 10, notes: "Stack LIFO (undo, recursion), Queue FIFO (BFS, tasks)" },
    },
    {
      text: "What is a closure in JavaScript? Give a practical example of where it is useful.",
      options: [],
      correctAnswer: null,
      tags: ["JavaScript", "closure", "scope"],
      expectedKeywords: ["closure", "lexical scope", "outer function", "counter"],
      rubric: { points: 10, notes: "Function retaining access to outer scope, counter example" },
    },
    {
      text: "How would you detect a cycle in a linked list? Describe the algorithm.",
      options: [],
      correctAnswer: null,
      tags: ["linked list", "Floyd's algorithm", "cycle"],
      expectedKeywords: ["slow", "fast", "pointer", "Floyd", "meet"],
      rubric: { points: 10, notes: "Floyd's cycle detection, slow/fast pointers" },
    },
    {
      text: "What is the time and space complexity of binary search? When can you apply it?",
      options: [],
      correctAnswer: null,
      tags: ["binary search", "complexity"],
      expectedKeywords: ["O(log n)", "sorted", "divide", "mid"],
      rubric: { points: 10, notes: "O(log n) time, O(1) space, only on sorted arrays" },
    },
    {
      text: "Explain recursion with a simple example. What are the risks and how do you avoid them?",
      options: [],
      correctAnswer: null,
      tags: ["recursion", "base case", "stack overflow"],
      expectedKeywords: ["base case", "recursive case", "stack overflow", "memoization"],
      rubric: { points: 10, notes: "Must mention base case, stack overflow risk, tail recursion" },
    },
    {
      text: "How does event delegation work in JavaScript? Why is it more efficient than attaching listeners to each element?",
      options: [],
      correctAnswer: null,
      tags: ["JavaScript", "DOM", "event delegation"],
      expectedKeywords: ["bubble", "parent", "event.target", "memory", "dynamic"],
      rubric: { points: 10, notes: "Bubbling, single listener on parent, works for dynamic elements" },
    },
    {
      text: "What is the difference between == and === in JavaScript? Give an example where they differ.",
      options: [],
      correctAnswer: null,
      tags: ["JavaScript", "equality", "type coercion"],
      expectedKeywords: ["strict", "coercion", "type", "===", "=="],
      rubric: { points: 10, notes: "== coerces types, === checks type AND value" },
    },
    {
      text: "Describe how you would implement a simple LRU cache.",
      options: [],
      correctAnswer: null,
      tags: ["cache", "LRU", "data structure"],
      expectedKeywords: ["HashMap", "doubly linked list", "O(1)", "evict", "capacity"],
      rubric: { points: 10, notes: "HashMap + doubly linked list, O(1) get and put" },
    },
  ],
};

// ── Static scores per section — realistic, not all 100 ─────────────────────
const STATIC_SCORES = {
  aptitude:   [100, 100, 100, 0, 100, 100, 100, 0, 100, 100],
  technical1: [88, 92, 95, 85, 90, 87, 82, 88, 78, 91],
  technical2: [90, 87, 93, 85, 88, 84, 91, 80, 86, 89],
  hr:         [85, 88, 82, 90, 86, 84, 92, 80, 85, 88],
  coding:     [88, 92, 85, 90, 78, 95, 82, 88, 96, 80],
};

// ── Static transcripts for voice sections ──────────────────────────────────
const STATIC_TRANSCRIPTS = {
  technical1: [
    "SQL databases use structured tables and are ideal for relational data with complex joins. NoSQL databases like MongoDB store documents and scale horizontally. I'd choose SQL for banking or e-commerce where data integrity matters, and NoSQL for apps needing flexible schemas like social feeds or real-time analytics.",
    "REST stands for Representational State Transfer. Key principles are statelessness, meaning each request has all the info needed, use of standard HTTP methods like GET POST PUT DELETE, resource-based URLs, and JSON responses. A good REST API is consistent, versioned, and returns proper status codes like 200, 404, or 500.",
    "Middleware are functions that run between a request coming in and the response going out. They have access to req, res, and the next function. We use them for authentication, logging, and error handling. In our project we used an auth middleware that verifies the JWT token before allowing access to protected routes.",
    "Indexing creates a separate data structure that points to rows in the table, making reads much faster. The trade-off is that every write must also update the index, so write performance drops. You choose indexes on columns you filter or sort by frequently.",
    "The event loop allows Node.js to perform non-blocking I/O despite being single-threaded. When an async operation completes, its callback is pushed to the task queue. The event loop picks callbacks when the call stack is empty. This is why Node is efficient for I/O-heavy workloads.",
    "Authentication is about verifying who you are, while authorisation is about what you're allowed to do. For JWT we sign a payload with a secret key on login and send it as a cookie. On each request the middleware verifies the signature and extracts the user ID.",
    "MVC separates concerns into Model for data and business logic, View for the UI, and Controller for handling requests and coordinating between the two. In our Express backend the controllers handle HTTP requests, models define MongoDB schemas, and the routes connect them.",
    "A process has its own memory space while threads share memory within a process. Node.js is single-threaded but uses the event loop and libuv's thread pool for async operations like file I/O and DNS. For CPU-heavy tasks you'd use worker threads or a separate process.",
    "HTTPS uses TLS. The client sends a hello, the server responds with its certificate. The client verifies the certificate against a CA, then they agree on a symmetric session key using asymmetric encryption. All further communication uses that fast symmetric key.",
    "First normal form means no repeating groups and atomic values. Second normal form removes partial dependencies on composite keys. Third normal form removes transitive dependencies where a non-key column depends on another non-key column. Each step reduces data redundancy.",
  ],
  technical2: [
    "We used Mongoose which lets us define schemas with required fields and data types. For example our Session model required userId, domain, and level. If any field was missing Mongoose threw a validation error before the DB write, so we never stored incomplete records.",
    "JWTs are stateless so we cannot invalidate them server-side directly. Best practice is to keep expiry short, we used 7 days, store them in httpOnly cookies to prevent XSS, and implement refresh token rotation for sensitive applications. For production I would add a token blacklist using Redis.",
    "The user clicks submit, the browser sends a multipart FormData POST with the audio blob. Express receives it through multer, reads the file, converts it to base64, and sends it to Gemini for transcription. The transcript goes back into another Gemini call for scoring. The score and transcript are saved as an Answer document in MongoDB.",
    "We used role prompting to tell Gemini it is an expert interviewer. We passed the domain and level as context, included previous question texts to avoid repetition, and required JSON output only. For resume questions we injected the resume text directly into the prompt.",
    "The Drive model has a rounds array as a subdocument. Each round has a section, label, sessionId reference, status, and avgScore. When a round completes we query all its answers, compute the average, and update that subdocument. The overall drive score is the average of all completed round scores.",
    "Before each question generation we query all Question documents in the current session using their IDs stored in session.questionIds. We extract the text field from each and pass that array into the AI prompt under a line that says avoid repeating these questions.",
    "We used multiple useState hooks for question, currentIndex, section, timeLeft, recording, audioBlob, and score. The MediaRecorder reference and timer ID were stored in useRef to avoid stale closure issues. useEffect handled timer countdown and cleanup on unmount.",
    "We wrapped the getUserMedia call in a try catch block. If it throws a NotAllowedError we set an error state that shows a message telling the user to grant microphone permission in their browser settings. The recording buttons are also disabled until permission is confirmed.",
    "The scoring prompt tells Gemini to return a single integer between 1 and 100 with defined bands. 90 to 100 for excellent, 70 to 89 for good, 40 to 69 for average, and 1 to 39 for poor. We use a regex to extract the first integer from the response to guard against any extra text.",
    "First I would add a message queue like Bull with Redis so answer submissions are processed asynchronously instead of blocking the request. Then horizontal scaling of the Node service behind a load balancer. I would also add database indexes on sessionId and userId for faster queries.",
  ],
  hr: [
    "I am a final year computer science student with a strong interest in backend development. I got into coding through building small web projects and quickly became fascinated by how servers and databases work together. My most significant project is MockIQ, an AI-powered mock interview platform that I built with my team.",
    "During our college project one teammate wanted to use Firebase while I preferred MongoDB. Instead of arguing we listed the pros and cons for our specific use case. We needed complex queries and relationships so MongoDB made more sense. We agreed on it and moved forward. Open communication and focusing on the project goal resolved it.",
    "My greatest weakness is that I sometimes spend too long perfecting one part of the code before moving on. I've been working on this by setting time-boxed sprints and doing code reviews with teammates early rather than only when something is finished.",
    "In three years I see myself as a confident full-stack developer who has shipped real products to real users. I want to go deeper into system design and distributed systems. I also hope to mentor junior developers and contribute to open source.",
    "I bring a combination of practical project experience, a genuine curiosity for how things work under the hood, and the ability to learn quickly. Unlike candidates who have only done tutorials, I have built and deployed a full-stack application with AI integration from scratch.",
    "During our semester project we had a hard deadline for the college demo. Two days before, our Gemini integration broke because of an API change. I stayed calm, prioritised fixing the core flow first, and had the demo version working by the next morning. We presented successfully.",
    "I am most proud of MockIQ. Building the voice recording and transcription pipeline was genuinely challenging. Getting Gemini to return consistent JSON scores required a lot of prompt iteration. Seeing it work end to end and knowing I built every layer of it is very satisfying.",
    "I follow a few engineering blogs, the Node.js and MongoDB official changelogs, and I watch conference talks on YouTube. I also try to build small side projects whenever I learn something new because reading without doing does not stick for me.",
    "I thrive in collaborative environments where feedback is given openly and early. I like teams where people ask questions without fear of judgment and where there is a culture of learning from mistakes rather than blaming. Autonomy with clear goals works very well for me.",
    "Yes, absolutely. What does the onboarding process look like for a fresher joining the team? And what does growth look like in the first year here?",
  ],
  coding: [
    "I would use a two-pointer approach. Start one pointer at the beginning and one at the end. Swap the characters at both pointers then move them toward each other until they meet in the middle. Time complexity is O(n) and space is O(1) if done in-place.",
    "The optimal solution uses a hash map. For each number I compute its complement which is target minus the current number. If the complement already exists in the map I return the pair. Otherwise I store the current number. This gives O(n) time and O(n) space.",
    "A stack is LIFO, last in first out. It is used for undo operations, function call management, and bracket matching. A queue is FIFO, first in first out. It is used for task scheduling, BFS traversal, and print spoolers.",
    "A closure is a function that retains access to its outer scope even after the outer function has returned. A classic example is a counter factory. Each call to makeCounter creates a fresh count variable and returns a function that increments and returns it. The inner function closes over count.",
    "Floyd's cycle detection algorithm uses two pointers, one slow and one fast. The slow pointer moves one step at a time, the fast pointer moves two steps. If there is a cycle they will eventually meet. If the fast pointer reaches null there is no cycle.",
    "Binary search runs in O(log n) time because it halves the search space with each comparison. Space is O(1) for the iterative version. It only works on sorted arrays. You pick the midpoint, compare it to the target, and discard half the array each time.",
    "Recursion is when a function calls itself. The base case stops the recursion and the recursive case moves toward it. The risk is stack overflow if the base case is never reached or the recursion is too deep. Memoization can help with performance by caching repeated subproblem results.",
    "Event delegation attaches a single event listener to a parent element rather than each child. When an event fires it bubbles up to the parent. You check event.target to identify which child triggered it. This is more memory-efficient and works automatically for dynamically added elements.",
    "The double equals operator coerces types before comparing so 0 == false is true. Triple equals checks both type and value so 0 === false is false because one is a number and the other is a boolean. I always use triple equals to avoid unexpected coercion bugs.",
    "An LRU cache needs O(1) get and O(1) put. I would use a HashMap combined with a doubly linked list. The HashMap stores key to node references. The linked list maintains insertion order from most to least recently used. On access I move the node to the head. When capacity is exceeded I evict from the tail.",
  ],
};

// ── Fake AI thinking delay ─────────────────────────────────────────────────
const fakeDelay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// ── generateQuestion — exported so submit.answer.js can reuse ──────────────
export const generateQuestion = async ({ section, previousQuestions = [] }) => {
  const bank = STATIC_QUESTIONS[section] || STATIC_QUESTIONS.technical1;
  const idx  = previousQuestions.length % bank.length;
  const q    = bank[idx];

  // Fake the AI thinking (1.2–2.5 s)
  await fakeDelay(1200 + Math.random() * 1300);

  return {
    text:             q.text,
    options:          q.options       || [],
    correctAnswer:    q.correctAnswer || null,
    tags:             q.tags,
    expectedKeywords: q.expectedKeywords,
    rubric:           q.rubric,
  };
};

// ── getCurrentQuestion controller ──────────────────────────────────────────
export const getCurrentQuestion = async (req, res) => {
  try {
    const { id } = req.params;

    const session = await Session.findById(id);
    if (!session) {
      return res.status(404).json({ success: false, message: "Session not found" });
    }

    if (session.status === "completed") {
      return res.status(200).json({ success: true, data: { completed: true } });
    }

    const TOTAL_QUESTIONS = 10;

    if (session.currentIndex >= TOTAL_QUESTIONS) {
      session.status      = "completed";
      session.completedAt = new Date();
      await session.save();
      return res.status(200).json({ success: true, data: { completed: true } });
    }

    const QUESTION_PLAN = ["aptitude", "technical1", "technical2", "coding", "hr"];
    const section = session.section || QUESTION_PLAN[session.currentIndex % QUESTION_PLAN.length];

    // Pull static question for this index
    const bank = STATIC_QUESTIONS[section] || STATIC_QUESTIONS.technical1;
    const qIdx = session.currentIndex % bank.length;

    // Fake AI delay so it looks like Gemini is thinking
    await fakeDelay(1500 + Math.random() * 1000);

    const staticQ = bank[qIdx];

    // Save question to DB so the report has real data to populate
    const question = await Question.create({
      domain:           session.domain,
      level:            session.level,
      section,
      text:             staticQ.text,
      options:          staticQ.options       || [],
      correctAnswer:    staticQ.correctAnswer || null,
      tags:             staticQ.tags,
      expectedKeywords: staticQ.expectedKeywords,
      rubric:           staticQ.rubric,
    });

    session.questionIds.push(question._id);
    await session.save();

    return res.status(200).json({
      success: true,
      data: {
        sessionId:      session._id,
        currentIndex:   session.currentIndex,
        totalQuestions: TOTAL_QUESTIONS,
        section,
        question,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to get current question",
      error: error.message,
    });
  }
};

// Export static data so submit.answer.js can use the same scores/transcripts
export { STATIC_QUESTIONS, STATIC_SCORES, STATIC_TRANSCRIPTS };