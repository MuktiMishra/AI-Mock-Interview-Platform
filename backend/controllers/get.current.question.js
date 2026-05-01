import Session  from "../models/session.model.js";
import Question from "../models/question.model.js";
import { technical1_devops, technical1_ml, technical2_devops, technical2_ml } from "../utils/new_domain_questions.js";

// ── Static question bank ───────────────────────────────────────────────────
// aptitude + hr are domain-agnostic (flat arrays).
// technical1, technical2, coding are domain-specific objects keyed by domain.

const STATIC_QUESTIONS = {

  // ── APTITUDE (domain-agnostic) ──────────────────────────────────────────
  aptitude: [
    { text: "A train travels 60 km in 45 minutes. What is its speed in km/h?", options: ["A. 72 km/h", "B. 80 km/h", "C. 90 km/h", "D. 75 km/h"], correctAnswer: "B", tags: ["speed", "time", "distance"], expectedKeywords: [], rubric: { points: 10, notes: "60 ÷ 0.75 = 80 km/h" } },
    { text: "If 8 workers complete a job in 12 days, how many days will 6 workers take?", options: ["A. 14 days", "B. 15 days", "C. 16 days", "D. 18 days"], correctAnswer: "C", tags: ["work", "time", "men"], expectedKeywords: [], rubric: { points: 10, notes: "8×12 ÷ 6 = 16 days" } },
    { text: "What is the next number in the series: 2, 6, 12, 20, 30, ?", options: ["A. 40", "B. 42", "C. 44", "D. 38"], correctAnswer: "B", tags: ["series", "pattern"], expectedKeywords: [], rubric: { points: 10, notes: "n(n+1): 6×7 = 42" } },
    { text: "A shopkeeper sells an item at 20% profit. If the cost price is ₹500, what is the selling price?", options: ["A. ₹550", "B. ₹580", "C. ₹600", "D. ₹620"], correctAnswer: "C", tags: ["profit", "percentage"], expectedKeywords: [], rubric: { points: 10, notes: "500 × 1.2 = 600" } },
    { text: "Find the odd one out: 121, 144, 169, 196, 225, 250", options: ["A. 196", "B. 225", "C. 250", "D. 169"], correctAnswer: "C", tags: ["odd one out", "squares"], expectedKeywords: [], rubric: { points: 10, notes: "250 is not a perfect square" } },
    { text: "If P is 25% more than Q, then Q is what percent less than P?", options: ["A. 20%", "B. 25%", "C. 15%", "D. 22%"], correctAnswer: "A", tags: ["percentage", "comparison"], expectedKeywords: [], rubric: { points: 10, notes: "25/125 × 100 = 20%" } },
    { text: "Two pipes A and B can fill a tank in 20 and 30 minutes respectively. If both are opened together, how long to fill the tank?", options: ["A. 10 min", "B. 12 min", "C. 15 min", "D. 8 min"], correctAnswer: "B", tags: ["pipes", "work"], expectedKeywords: [], rubric: { points: 10, notes: "1/(1/20+1/30) = 12 min" } },
    { text: "The average of 5 numbers is 30. If one number is excluded the average becomes 28. What is the excluded number?", options: ["A. 36", "B. 38", "C. 40", "D. 42"], correctAnswer: "B", tags: ["average"], expectedKeywords: [], rubric: { points: 10, notes: "5×30 − 4×28 = 150−112 = 38" } },
    { text: "In how many ways can the letters of the word LEVEL be arranged?", options: ["A. 30", "B. 40", "C. 60", "D. 20"], correctAnswer: "A", tags: ["permutation", "arrangement"], expectedKeywords: [], rubric: { points: 10, notes: "5!/(2!×2!) = 30" } },
    { text: "A clock shows 3:15. What is the angle between the hour and minute hands?", options: ["A. 0°", "B. 7.5°", "C. 15°", "D. 22.5°"], correctAnswer: "B", tags: ["clocks", "angles"], expectedKeywords: [], rubric: { points: 10, notes: "Hour hand at 97.5°, minute at 90°, diff = 7.5°" } },
    { text: "A car covers a distance of 480 km at a uniform speed. If the speed were 20 km/h more, it would take 2 hours less. What is the original speed?", options: ["A. 40 km/h", "B. 60 km/h", "C. 80 km/h", "D. 50 km/h"], correctAnswer: "B", tags: ["speed", "distance"], expectedKeywords: [], rubric: { points: 10, notes: "480/v − 480/(v+20) = 2 → v = 60" } },
    { text: "What is 15% of 240?", options: ["A. 32", "B. 36", "C. 40", "D. 38"], correctAnswer: "B", tags: ["percentage"], expectedKeywords: [], rubric: { points: 10, notes: "240 × 0.15 = 36" } },
    { text: "The ratio of A's age to B's age is 3:5. If A is 18 years old, how old is B?", options: ["A. 24", "B. 28", "C. 30", "D. 32"], correctAnswer: "C", tags: ["ratio", "age"], expectedKeywords: [], rubric: { points: 10, notes: "18/3 × 5 = 30" } },
    { text: "A man bought an article for ₹800 and sold it at a loss of 12.5%. What is the selling price?", options: ["A. ₹700", "B. ₹680", "C. ₹720", "D. ₹660"], correctAnswer: "A", tags: ["loss", "percentage"], expectedKeywords: [], rubric: { points: 10, notes: "800 × 0.875 = 700" } },
    { text: "What is the probability of getting a sum of 7 when two dice are thrown?", options: ["A. 1/6", "B. 5/36", "C. 7/36", "D. 1/4"], correctAnswer: "A", tags: ["probability", "dice"], expectedKeywords: [], rubric: { points: 10, notes: "6/36 = 1/6" } },
    { text: "Find the LCM of 12, 18, and 24.", options: ["A. 48", "B. 60", "C. 72", "D. 36"], correctAnswer: "C", tags: ["LCM", "numbers"], expectedKeywords: [], rubric: { points: 10, notes: "LCM(12,18,24) = 72" } },
    { text: "If x + y = 10 and x − y = 4, what is the value of xy?", options: ["A. 20", "B. 21", "C. 24", "D. 16"], correctAnswer: "B", tags: ["algebra"], expectedKeywords: [], rubric: { points: 10, notes: "x=7, y=3; xy=21" } },
    { text: "A sum doubles itself in 8 years at simple interest. What is the rate of interest?", options: ["A. 10%", "B. 12.5%", "C. 8%", "D. 15%"], correctAnswer: "B", tags: ["simple interest"], expectedKeywords: [], rubric: { points: 10, notes: "R = 100/8 = 12.5%" } },
    { text: "How many prime numbers are there between 10 and 40?", options: ["A. 6", "B. 7", "C. 8", "D. 5"], correctAnswer: "C", tags: ["prime numbers"], expectedKeywords: [], rubric: { points: 10, notes: "11,13,17,19,23,29,31,37 = 8" } },
    { text: "A triangle has sides 5, 12, and 13. What type of triangle is it?", options: ["A. Acute", "B. Obtuse", "C. Right-angled", "D. Equilateral"], correctAnswer: "C", tags: ["geometry", "triangle"], expectedKeywords: [], rubric: { points: 10, notes: "5²+12²=13² ✓ Right-angled" } },
  ],

  // ── TECHNICAL I (domain-specific) ──────────────────────────────────────
  technical1: {
    frontend: [
      { text: "Explain the difference between the real DOM and the virtual DOM. Why does React use a virtual DOM?", options: [], correctAnswer: null, tags: ["DOM", "React", "performance"], expectedKeywords: ["virtual DOM", "diffing", "reconciliation", "re-render", "performance"], rubric: { points: 10, notes: "Real DOM mutations are expensive; vDOM diffs and batches updates" } },
      { text: "What is the CSS box model? Explain content, padding, border, and margin.", options: [], correctAnswer: null, tags: ["CSS", "box model", "layout"], expectedKeywords: ["content", "padding", "border", "margin", "box-sizing"], rubric: { points: 10, notes: "Should mention box-sizing: border-box vs content-box" } },
      { text: "What are React hooks? Explain useState and useEffect with examples.", options: [], correctAnswer: null, tags: ["React", "hooks", "useState", "useEffect"], expectedKeywords: ["useState", "useEffect", "functional component", "side effect", "cleanup"], rubric: { points: 10, notes: "Cover state management and side effects, mention cleanup" } },
      { text: "What is CSS specificity and how does the cascade work?", options: [], correctAnswer: null, tags: ["CSS", "specificity", "cascade"], expectedKeywords: ["inline", "ID", "class", "element", "specificity weight"], rubric: { points: 10, notes: "Inline > ID > class > element, !important override" } },
      { text: "Explain the difference between flexbox and CSS grid. When would you use each?", options: [], correctAnswer: null, tags: ["CSS", "flexbox", "grid", "layout"], expectedKeywords: ["flexbox", "grid", "one-dimensional", "two-dimensional", "alignment"], rubric: { points: 10, notes: "Flex = 1D axis layout, Grid = 2D layout system" } },
      { text: "What is event bubbling and event capturing in the DOM?", options: [], correctAnswer: null, tags: ["JavaScript", "DOM", "events"], expectedKeywords: ["bubble", "capture", "target", "stopPropagation", "addEventListener"], rubric: { points: 10, notes: "Capture top→down, bubble bottom→up, stopPropagation" } },
      { text: "What is a Single Page Application? What are its advantages and disadvantages compared to MPA?", options: [], correctAnswer: null, tags: ["SPA", "MPA", "routing"], expectedKeywords: ["SPA", "client-side routing", "SEO", "initial load", "hydration"], rubric: { points: 10, notes: "SPA = JS renders pages; faster UX but worse initial SEO" } },
      { text: "Explain the concept of code splitting and lazy loading in React.", options: [], correctAnswer: null, tags: ["React", "performance", "lazy loading"], expectedKeywords: ["React.lazy", "Suspense", "dynamic import", "chunk", "bundle"], rubric: { points: 10, notes: "React.lazy + Suspense, dynamic import(), reduces initial bundle" } },
      { text: "What is CORS and why do browsers enforce it? How do you fix a CORS error?", options: [], correctAnswer: null, tags: ["CORS", "security", "HTTP"], expectedKeywords: ["CORS", "origin", "preflight", "Access-Control-Allow-Origin", "same-origin"], rubric: { points: 10, notes: "Same-origin policy, preflight OPTIONS request, server sets headers" } },
      { text: "What are CSS custom properties (variables) and how do they differ from preprocessor variables?", options: [], correctAnswer: null, tags: ["CSS", "variables", "custom properties"], expectedKeywords: ["--variable", "var()", "cascade", "runtime", "SASS"], rubric: { points: 10, notes: "CSS vars are runtime and cascade; SASS vars compile away" } },
      { text: "Explain how React's useContext hook works and when you'd use it over prop drilling.", options: [], correctAnswer: null, tags: ["React", "context", "state"], expectedKeywords: ["Context", "Provider", "Consumer", "prop drilling", "global state"], rubric: { points: 10, notes: "Context avoids prop drilling for global/shared state" } },
      { text: "What is the difference between localStorage, sessionStorage, and cookies?", options: [], correctAnswer: null, tags: ["browser storage", "cookies", "localStorage"], expectedKeywords: ["localStorage", "sessionStorage", "cookie", "expiry", "httpOnly"], rubric: { points: 10, notes: "Storage: no expiry vs session; cookies sent with requests, httpOnly flag" } },
      { text: "What is server-side rendering (SSR) and how does it differ from client-side rendering?", options: [], correctAnswer: null, tags: ["SSR", "CSR", "Next.js"], expectedKeywords: ["SSR", "CSR", "hydration", "SEO", "TTFB"], rubric: { points: 10, notes: "SSR sends HTML from server; better SEO and TTFB, needs hydration" } },
      { text: "How does the browser's critical rendering path work?", options: [], correctAnswer: null, tags: ["browser", "rendering", "performance"], expectedKeywords: ["DOM", "CSSOM", "render tree", "layout", "paint"], rubric: { points: 10, notes: "Parse HTML→DOM, CSS→CSSOM, combine→render tree, layout, paint" } },
      { text: "What are web accessibility (a11y) best practices? Why do they matter?", options: [], correctAnswer: null, tags: ["accessibility", "a11y", "ARIA"], expectedKeywords: ["ARIA", "alt text", "semantic HTML", "keyboard navigation", "screen reader"], rubric: { points: 10, notes: "Semantic HTML, ARIA roles, keyboard nav, color contrast" } },
      { text: "Explain the difference between useMemo and useCallback in React.", options: [], correctAnswer: null, tags: ["React", "performance", "hooks"], expectedKeywords: ["useMemo", "useCallback", "memoization", "dependency array", "re-render"], rubric: { points: 10, notes: "useMemo caches value, useCallback caches function reference" } },
      { text: "What is a CSS media query and how do you implement responsive design?", options: [], correctAnswer: null, tags: ["CSS", "responsive", "media query"], expectedKeywords: ["media query", "breakpoint", "mobile-first", "viewport", "fluid"], rubric: { points: 10, notes: "Mobile-first approach, min-width breakpoints, fluid units" } },
      { text: "What is the difference between controlled and uncontrolled components in React?", options: [], correctAnswer: null, tags: ["React", "forms", "controlled"], expectedKeywords: ["controlled", "uncontrolled", "ref", "onChange", "state"], rubric: { points: 10, notes: "Controlled: state drives value; uncontrolled: DOM handles it via ref" } },
      { text: "How does browser caching work and what cache-control headers are available?", options: [], correctAnswer: null, tags: ["caching", "HTTP", "performance"], expectedKeywords: ["cache-control", "max-age", "ETag", "no-cache", "stale-while-revalidate"], rubric: { points: 10, notes: "Cache-Control directives, ETag validation, stale-while-revalidate" } },
      { text: "What is the purpose of a bundler like Webpack or Vite? What problems do they solve?", options: [], correctAnswer: null, tags: ["bundler", "Webpack", "Vite", "build tools"], expectedKeywords: ["bundle", "module", "tree shaking", "HMR", "transpile"], rubric: { points: 10, notes: "Bundle modules, tree shake dead code, transpile, dev server with HMR" } },
    ],

    backend: [
      { text: "What is the difference between SQL and NoSQL databases? When would you choose one over the other?", options: [], correctAnswer: null, tags: ["databases", "SQL", "NoSQL"], expectedKeywords: ["SQL", "NoSQL", "relational", "schema", "scalability"], rubric: { points: 10, notes: "Relational vs document, ACID vs eventual consistency" } },
      { text: "Explain REST API design principles. What makes an API truly RESTful?", options: [], correctAnswer: null, tags: ["API", "REST", "HTTP"], expectedKeywords: ["stateless", "HTTP methods", "resources", "JSON", "status codes"], rubric: { points: 10, notes: "Statelessness, uniform interface, HTTP verbs, status codes" } },
      { text: "What is middleware in Express.js and how does the request-response cycle work?", options: [], correctAnswer: null, tags: ["Express", "middleware", "Node.js"], expectedKeywords: ["req", "res", "next", "pipeline", "authentication"], rubric: { points: 10, notes: "next() chaining, use cases like auth/logging" } },
      { text: "Explain the concept of indexing in databases. What are its trade-offs?", options: [], correctAnswer: null, tags: ["indexing", "performance", "database"], expectedKeywords: ["index", "query speed", "write overhead", "B-tree"], rubric: { points: 10, notes: "Faster reads vs slower writes, storage overhead" } },
      { text: "What is the event loop in Node.js and how does it handle asynchronous operations?", options: [], correctAnswer: null, tags: ["Node.js", "event loop", "async"], expectedKeywords: ["event loop", "callback queue", "non-blocking", "single thread"], rubric: { points: 10, notes: "Call stack, task queue, microtasks" } },
      { text: "What are the differences between authentication and authorisation? How would you implement JWT authentication?", options: [], correctAnswer: null, tags: ["auth", "JWT", "security"], expectedKeywords: ["authentication", "authorisation", "JWT", "token", "secret"], rubric: { points: 10, notes: "Auth = who you are, authz = what you can do" } },
      { text: "Explain the MVC design pattern with a real example.", options: [], correctAnswer: null, tags: ["MVC", "design pattern", "architecture"], expectedKeywords: ["model", "view", "controller", "separation of concerns"], rubric: { points: 10, notes: "Clear separation, concrete example" } },
      { text: "What is the difference between process and thread? How does Node.js handle concurrency?", options: [], correctAnswer: null, tags: ["process", "thread", "concurrency"], expectedKeywords: ["process", "thread", "single threaded", "worker threads"], rubric: { points: 10, notes: "Node is single-threaded but non-blocking via event loop" } },
      { text: "How does HTTPS work? Explain the TLS handshake at a high level.", options: [], correctAnswer: null, tags: ["HTTPS", "TLS", "security"], expectedKeywords: ["TLS", "certificate", "encryption", "handshake", "symmetric key"], rubric: { points: 10, notes: "Asymmetric key exchange, then symmetric encryption" } },
      { text: "What is database normalisation? Explain 1NF, 2NF, and 3NF.", options: [], correctAnswer: null, tags: ["normalisation", "database design"], expectedKeywords: ["1NF", "2NF", "3NF", "redundancy", "dependency"], rubric: { points: 10, notes: "Each NF eliminates another form of redundancy" } },
      { text: "What is the difference between synchronous and asynchronous programming? Give examples in JavaScript.", options: [], correctAnswer: null, tags: ["async", "sync", "JavaScript"], expectedKeywords: ["async", "await", "Promise", "callback", "blocking"], rubric: { points: 10, notes: "Blocking vs non-blocking, Promises/async-await" } },
      { text: "Explain the concept of microservices. How does it differ from a monolithic architecture?", options: [], correctAnswer: null, tags: ["microservices", "monolith", "architecture"], expectedKeywords: ["microservices", "monolith", "scalability", "independent deployment", "API gateway"], rubric: { points: 10, notes: "Independent services vs single deployable unit" } },
      { text: "What is a CDN and how does it improve web performance?", options: [], correctAnswer: null, tags: ["CDN", "performance", "web"], expectedKeywords: ["CDN", "edge server", "latency", "caching", "geographic"], rubric: { points: 10, notes: "Edge servers, cached assets, reduced latency" } },
      { text: "Describe how you would design a rate limiter for an API.", options: [], correctAnswer: null, tags: ["rate limiting", "API", "system design"], expectedKeywords: ["rate limit", "token bucket", "sliding window", "Redis", "429"], rubric: { points: 10, notes: "Token bucket or sliding window, Redis for distributed counting" } },
      { text: "What are WebSockets and when would you use them over HTTP?", options: [], correctAnswer: null, tags: ["WebSockets", "real-time", "HTTP"], expectedKeywords: ["WebSocket", "real-time", "bidirectional", "HTTP upgrade", "socket.io"], rubric: { points: 10, notes: "Persistent bidirectional connection, good for chat/live data" } },
      { text: "Explain the CAP theorem. How does it affect distributed database design?", options: [], correctAnswer: null, tags: ["CAP theorem", "distributed systems"], expectedKeywords: ["consistency", "availability", "partition tolerance", "trade-off"], rubric: { points: 10, notes: "Can only guarantee 2 of 3 in distributed systems" } },
      { text: "What is caching and what are common caching strategies?", options: [], correctAnswer: null, tags: ["caching", "performance"], expectedKeywords: ["cache", "Redis", "TTL", "LRU", "write-through", "write-back"], rubric: { points: 10, notes: "LRU eviction, TTL, write-through vs write-back" } },
      { text: "How do you handle errors in a Node.js Express application?", options: [], correctAnswer: null, tags: ["error handling", "Express", "Node.js"], expectedKeywords: ["try catch", "error middleware", "next(err)", "status codes", "logging"], rubric: { points: 10, notes: "Global error middleware, next(err), proper status codes" } },
      { text: "What is the difference between horizontal and vertical scaling?", options: [], correctAnswer: null, tags: ["scaling", "system design"], expectedKeywords: ["horizontal", "vertical", "load balancer", "sharding", "bottleneck"], rubric: { points: 10, notes: "Vertical = bigger machine, horizontal = more machines with LB" } },
      { text: "Explain the concept of idempotency in REST APIs. Why is it important?", options: [], correctAnswer: null, tags: ["REST", "idempotency", "API design"], expectedKeywords: ["idempotent", "GET", "PUT", "DELETE", "duplicate requests"], rubric: { points: 10, notes: "Same request multiple times = same result, critical for retries" } },
    ],

    "web-dev": [
      { text: "Explain the difference between the real DOM and the virtual DOM. Why does React use a virtual DOM?", options: [], correctAnswer: null, tags: ["DOM", "React", "performance"], expectedKeywords: ["virtual DOM", "diffing", "reconciliation", "re-render", "performance"], rubric: { points: 10, notes: "Real DOM mutations are expensive; vDOM diffs and batches updates" } },
      { text: "What is the difference between SQL and NoSQL databases? When would you choose one over the other?", options: [], correctAnswer: null, tags: ["databases", "SQL", "NoSQL"], expectedKeywords: ["SQL", "NoSQL", "relational", "schema", "scalability"], rubric: { points: 10, notes: "Relational vs document model, use cases" } },
      { text: "What are React hooks? Explain useState and useEffect with examples.", options: [], correctAnswer: null, tags: ["React", "hooks", "useState", "useEffect"], expectedKeywords: ["useState", "useEffect", "functional component", "side effect", "cleanup"], rubric: { points: 10, notes: "Cover state management and side effects, mention cleanup" } },
      { text: "Explain REST API design principles. What makes an API truly RESTful?", options: [], correctAnswer: null, tags: ["API", "REST", "HTTP"], expectedKeywords: ["stateless", "HTTP methods", "resources", "JSON", "status codes"], rubric: { points: 10, notes: "Statelessness, uniform interface, HTTP verbs" } },
      { text: "What is CORS and why do browsers enforce it? How do you fix a CORS error?", options: [], correctAnswer: null, tags: ["CORS", "security", "HTTP"], expectedKeywords: ["CORS", "origin", "preflight", "Access-Control-Allow-Origin", "same-origin"], rubric: { points: 10, notes: "Same-origin policy, preflight OPTIONS request, server sets headers" } },
      { text: "What is the event loop in Node.js and how does it handle asynchronous operations?", options: [], correctAnswer: null, tags: ["Node.js", "event loop", "async"], expectedKeywords: ["event loop", "callback queue", "non-blocking", "single thread"], rubric: { points: 10, notes: "Call stack, task queue, microtasks" } },
      { text: "What is middleware in Express.js and how does the request-response cycle work?", options: [], correctAnswer: null, tags: ["Express", "middleware", "Node.js"], expectedKeywords: ["req", "res", "next", "pipeline", "authentication"], rubric: { points: 10, notes: "next() chaining, use cases like auth/logging" } },
      { text: "What is a Single Page Application? What are its advantages and disadvantages?", options: [], correctAnswer: null, tags: ["SPA", "MPA", "routing"], expectedKeywords: ["SPA", "client-side routing", "SEO", "initial load", "hydration"], rubric: { points: 10, notes: "SPA = JS renders pages; faster UX but worse initial SEO" } },
      { text: "What are the differences between authentication and authorisation? How would you implement JWT?", options: [], correctAnswer: null, tags: ["auth", "JWT", "security"], expectedKeywords: ["authentication", "authorisation", "JWT", "token", "secret"], rubric: { points: 10, notes: "Auth = who you are, authz = what you can do" } },
      { text: "Explain the difference between flexbox and CSS grid. When would you use each?", options: [], correctAnswer: null, tags: ["CSS", "flexbox", "grid", "layout"], expectedKeywords: ["flexbox", "grid", "one-dimensional", "two-dimensional", "alignment"], rubric: { points: 10, notes: "Flex = 1D axis layout, Grid = 2D layout system" } },
      { text: "What is server-side rendering (SSR) and how does it differ from client-side rendering?", options: [], correctAnswer: null, tags: ["SSR", "CSR", "Next.js"], expectedKeywords: ["SSR", "CSR", "hydration", "SEO", "TTFB"], rubric: { points: 10, notes: "SSR sends HTML from server; better SEO and TTFB, needs hydration" } },
      { text: "Explain the concept of indexing in databases. What are its trade-offs?", options: [], correctAnswer: null, tags: ["indexing", "performance", "database"], expectedKeywords: ["index", "query speed", "write overhead", "B-tree"], rubric: { points: 10, notes: "Faster reads vs slower writes, storage overhead" } },
      { text: "What is the difference between localStorage, sessionStorage, and cookies?", options: [], correctAnswer: null, tags: ["browser storage", "cookies", "localStorage"], expectedKeywords: ["localStorage", "sessionStorage", "cookie", "expiry", "httpOnly"], rubric: { points: 10, notes: "Storage: no expiry vs session; cookies sent with requests" } },
      { text: "What is caching and what are common caching strategies?", options: [], correctAnswer: null, tags: ["caching", "performance"], expectedKeywords: ["cache", "Redis", "TTL", "LRU", "write-through"], rubric: { points: 10, notes: "LRU eviction, TTL, write-through vs write-back" } },
      { text: "How do you handle errors in a Node.js Express application?", options: [], correctAnswer: null, tags: ["error handling", "Express", "Node.js"], expectedKeywords: ["try catch", "error middleware", "next(err)", "status codes", "logging"], rubric: { points: 10, notes: "Global error middleware, next(err), proper status codes" } },
      { text: "What is the difference between synchronous and asynchronous programming?", options: [], correctAnswer: null, tags: ["async", "sync", "JavaScript"], expectedKeywords: ["async", "await", "Promise", "callback", "blocking"], rubric: { points: 10, notes: "Blocking vs non-blocking, Promises/async-await" } },
      { text: "How does the browser's critical rendering path work?", options: [], correctAnswer: null, tags: ["browser", "rendering", "performance"], expectedKeywords: ["DOM", "CSSOM", "render tree", "layout", "paint"], rubric: { points: 10, notes: "Parse HTML→DOM, CSS→CSSOM, combine→render tree, layout, paint" } },
      { text: "What is the MVC design pattern? Give a full-stack example.", options: [], correctAnswer: null, tags: ["MVC", "design pattern", "architecture"], expectedKeywords: ["model", "view", "controller", "separation of concerns"], rubric: { points: 10, notes: "React as View, Express controllers, Mongoose models" } },
      { text: "What are WebSockets and when would you use them over HTTP?", options: [], correctAnswer: null, tags: ["WebSockets", "real-time", "HTTP"], expectedKeywords: ["WebSocket", "real-time", "bidirectional", "HTTP upgrade", "socket.io"], rubric: { points: 10, notes: "Persistent bidirectional connection, chat/live data use cases" } },
      { text: "What is the difference between horizontal and vertical scaling? Give a full-stack example.", options: [], correctAnswer: null, tags: ["scaling", "system design"], expectedKeywords: ["horizontal", "vertical", "load balancer", "sharding", "bottleneck"], rubric: { points: 10, notes: "Vertical = bigger machine, horizontal = more machines with LB" } },
    ],
    "devops": technical1_devops, 
    "ml": technical1_ml
  },

  // ── TECHNICAL II (domain-specific, resume-based) ────────────────────────
  technical2: {
    frontend: [
      { text: "Your resume mentions React. Walk me through how you structured component state in your most complex project.", options: [], correctAnswer: null, tags: ["React", "state", "architecture"], expectedKeywords: ["useState", "useReducer", "Context", "props", "lifting state"], rubric: { points: 10, notes: "Should show awareness of state colocation and lifting" } },
      { text: "You listed CSS in your skills. How did you handle responsive design in your project — what approach did you take?", options: [], correctAnswer: null, tags: ["CSS", "responsive", "media query"], expectedKeywords: ["media query", "flexbox", "grid", "mobile-first", "breakpoint"], rubric: { points: 10, notes: "Mobile-first, specific breakpoints, fluid layouts" } },
      { text: "Describe a performance bottleneck you encountered in a frontend project and how you diagnosed and fixed it.", options: [], correctAnswer: null, tags: ["performance", "debugging", "React"], expectedKeywords: ["re-render", "memoization", "lazy loading", "profiler", "bundle size"], rubric: { points: 10, notes: "Should mention tooling: React DevTools Profiler, Lighthouse" } },
      { text: "How did you manage API calls in your frontend project? How did you handle loading and error states?", options: [], correctAnswer: null, tags: ["API", "async", "UX"], expectedKeywords: ["axios", "fetch", "loading", "error state", "useEffect"], rubric: { points: 10, notes: "Loading skeletons, error boundaries or local error state" } },
      { text: "Walk me through how authentication worked end-to-end in your frontend project.", options: [], correctAnswer: null, tags: ["auth", "JWT", "frontend"], expectedKeywords: ["token", "cookie", "protected route", "redirect", "axios interceptor"], rubric: { points: 10, notes: "Login → token storage → protected routes → interceptors" } },
      { text: "How did you implement routing in your React project? How did you handle protected routes?", options: [], correctAnswer: null, tags: ["React Router", "routing", "protected routes"], expectedKeywords: ["React Router", "Route", "Navigate", "useNavigate", "PrivateRoute"], rubric: { points: 10, notes: "React Router v6, wrapper component for auth check" } },
      { text: "Your resume mentions a UI project. How did you ensure your UI was accessible to users with disabilities?", options: [], correctAnswer: null, tags: ["accessibility", "a11y", "ARIA"], expectedKeywords: ["ARIA", "alt text", "semantic HTML", "keyboard", "focus"], rubric: { points: 10, notes: "Semantic elements, ARIA labels, keyboard nav, focus management" } },
      { text: "How did you handle form validation in your project — client-side and/or server-side?", options: [], correctAnswer: null, tags: ["forms", "validation", "React"], expectedKeywords: ["validation", "error message", "onBlur", "required", "regex"], rubric: { points: 10, notes: "Client-side for UX, server-side for security" } },
      { text: "Describe how you would add dark mode support to your existing frontend project.", options: [], correctAnswer: null, tags: ["CSS", "dark mode", "theming"], expectedKeywords: ["CSS variables", "prefers-color-scheme", "class toggle", "localStorage", "context"], rubric: { points: 10, notes: "CSS vars, system preference media query, saved preference" } },
      { text: "How did you optimise the initial load time of your frontend application?", options: [], correctAnswer: null, tags: ["performance", "optimization", "build"], expectedKeywords: ["code splitting", "lazy loading", "tree shaking", "compression", "CDN"], rubric: { points: 10, notes: "Code splitting, lazy routes, image optimization, CDN assets" } },
      { text: "Walk me through how you would implement a real-time feature like live notifications in your existing React project.", options: [], correctAnswer: null, tags: ["real-time", "WebSocket", "React"], expectedKeywords: ["WebSocket", "socket.io", "useEffect", "SSE", "event"], rubric: { points: 10, notes: "Socket.io or SSE, useEffect subscription, cleanup on unmount" } },
      { text: "How does your frontend project handle cross-browser compatibility issues?", options: [], correctAnswer: null, tags: ["cross-browser", "compatibility", "CSS"], expectedKeywords: ["polyfill", "Babel", "autoprefixer", "browserslist", "fallback"], rubric: { points: 10, notes: "Babel for JS, autoprefixer for CSS, feature detection" } },
      { text: "Explain how you would implement infinite scroll or pagination in your project.", options: [], correctAnswer: null, tags: ["pagination", "infinite scroll", "UX"], expectedKeywords: ["IntersectionObserver", "page", "offset", "cursor", "loading"], rubric: { points: 10, notes: "IntersectionObserver for infinite scroll, cursor-based pagination" } },
      { text: "How did you manage global state in your project? Would you add Redux or Zustand? Why or why not?", options: [], correctAnswer: null, tags: ["state management", "Redux", "Zustand"], expectedKeywords: ["Context", "Redux", "Zustand", "global state", "boilerplate"], rubric: { points: 10, notes: "Context for simple cases, Redux/Zustand for complex async state" } },
      { text: "Your project uses an API. How would you handle API versioning and backward compatibility on the frontend?", options: [], correctAnswer: null, tags: ["API", "versioning", "frontend"], expectedKeywords: ["versioning", "v1", "adapter", "feature flag", "graceful degradation"], rubric: { points: 10, notes: "URL versioning, adapter layer, feature flags" } },
      { text: "How would you write unit tests for a React component in your project?", options: [], correctAnswer: null, tags: ["testing", "React Testing Library", "Jest"], expectedKeywords: ["Jest", "React Testing Library", "render", "fireEvent", "mock"], rubric: { points: 10, notes: "RTL render, fireEvent/userEvent, assert DOM output, mock APIs" } },
      { text: "Describe how you handled image optimisation in your frontend project.", options: [], correctAnswer: null, tags: ["images", "performance", "optimization"], expectedKeywords: ["WebP", "lazy loading", "srcset", "compression", "CDN"], rubric: { points: 10, notes: "WebP format, lazy loading, srcset for responsive images, CDN" } },
      { text: "How would you implement a search feature with debouncing in your React project?", options: [], correctAnswer: null, tags: ["search", "debounce", "React"], expectedKeywords: ["debounce", "useEffect", "setTimeout", "clearTimeout", "API call"], rubric: { points: 10, notes: "useEffect with setTimeout, clear on re-render, avoid excessive API calls" } },
      { text: "Walk me through your component folder structure. How did you decide what to split into separate components?", options: [], correctAnswer: null, tags: ["architecture", "components", "React"], expectedKeywords: ["reusable", "single responsibility", "props", "composition", "atomic"], rubric: { points: 10, notes: "Single responsibility, reusability, composition over inheritance" } },
      { text: "How would you implement an offline mode or PWA features in your existing project?", options: [], correctAnswer: null, tags: ["PWA", "service worker", "offline"], expectedKeywords: ["service worker", "cache", "manifest", "offline", "IndexedDB"], rubric: { points: 10, notes: "Service worker for asset caching, manifest for installability" } },
    ],

    backend: [
      { text: "Your resume mentions Node.js and MongoDB. How did you handle schema validation before saving data to the database?", options: [], correctAnswer: null, tags: ["Mongoose", "schema", "validation"], expectedKeywords: ["Mongoose", "schema", "required", "validation", "error handling"], rubric: { points: 10, notes: "Mongoose validators, required fields, error handling" } },
      { text: "You listed JWT authentication in your project. What happens if a JWT token is stolen and how would you mitigate that?", options: [], correctAnswer: null, tags: ["JWT", "security", "tokens"], expectedKeywords: ["expiry", "httpOnly", "refresh token", "blacklist", "XSS"], rubric: { points: 10, notes: "Short expiry, httpOnly cookies, refresh token rotation" } },
      { text: "Walk me through the data flow in your backend project for a typical POST request — from the client to the database.", options: [], correctAnswer: null, tags: ["architecture", "data flow", "Express"], expectedKeywords: ["route", "middleware", "controller", "model", "MongoDB"], rubric: { points: 10, notes: "Route → middleware → controller → model → DB → response" } },
      { text: "How did you design your database schema? Walk me through the key design decisions.", options: [], correctAnswer: null, tags: ["schema design", "MongoDB", "database"], expectedKeywords: ["embed", "reference", "normalization", "index", "relationship"], rubric: { points: 10, notes: "Embed vs reference trade-offs, indexing strategy" } },
      { text: "How did you secure your API endpoints? What middleware did you use?", options: [], correctAnswer: null, tags: ["security", "middleware", "auth"], expectedKeywords: ["auth middleware", "JWT", "helmet", "rate limit", "CORS"], rubric: { points: 10, notes: "JWT verification, helmet, CORS config, rate limiting" } },
      { text: "How did you handle file uploads in your project? What were the security considerations?", options: [], correctAnswer: null, tags: ["file upload", "multer", "security"], expectedKeywords: ["multer", "MIME type", "file size", "S3", "validation"], rubric: { points: 10, notes: "multer config, MIME validation, size limits, S3 storage" } },
      { text: "Describe how you would add a queueing system to your backend to handle heavy tasks asynchronously.", options: [], correctAnswer: null, tags: ["queue", "async", "Bull"], expectedKeywords: ["Bull", "Redis", "queue", "worker", "job"], rubric: { points: 10, notes: "Bull/BullMQ with Redis, separate worker process" } },
      { text: "How did you implement pagination in your API? What are the trade-offs between offset and cursor-based pagination?", options: [], correctAnswer: null, tags: ["pagination", "API", "MongoDB"], expectedKeywords: ["skip", "limit", "cursor", "offset", "performance"], rubric: { points: 10, notes: "Offset simple but slow at scale; cursor is performant and stable" } },
      { text: "Walk me through your error handling strategy across the entire backend.", options: [], correctAnswer: null, tags: ["error handling", "Express", "middleware"], expectedKeywords: ["try catch", "next(err)", "global handler", "status codes", "logging"], rubric: { points: 10, notes: "Async wrapper, global error middleware, structured logging" } },
      { text: "If you were to scale this backend to 10,000 concurrent users, what would you change first?", options: [], correctAnswer: null, tags: ["scalability", "system design", "architecture"], expectedKeywords: ["load balancer", "queue", "Redis", "horizontal scaling", "caching"], rubric: { points: 10, notes: "Queue for async work, horizontal scaling, Redis caching, DB indexes" } },
      { text: "How did you implement logging in your backend project? What would you add in production?", options: [], correctAnswer: null, tags: ["logging", "monitoring", "production"], expectedKeywords: ["winston", "morgan", "log level", "structured logging", "Datadog"], rubric: { points: 10, notes: "morgan for HTTP, winston for app logs, structured JSON, alerting" } },
      { text: "How would you add a retry mechanism if a third-party API call fails in your backend?", options: [], correctAnswer: null, tags: ["error handling", "retry", "resilience"], expectedKeywords: ["retry", "exponential backoff", "try catch", "fallback", "timeout"], rubric: { points: 10, notes: "Exponential backoff, max retries, circuit breaker pattern" } },
      { text: "How do you prevent MongoDB injection or NoSQL injection attacks in your backend?", options: [], correctAnswer: null, tags: ["security", "MongoDB", "injection"], expectedKeywords: ["sanitize", "mongoose", "operator injection", "express-mongo-sanitize", "input validation"], rubric: { points: 10, notes: "Mongoose schema types, express-mongo-sanitize, input validation" } },
      { text: "Your API stores user data. How would you implement GDPR compliance features?", options: [], correctAnswer: null, tags: ["GDPR", "privacy", "data"], expectedKeywords: ["delete", "export", "consent", "anonymize", "data retention"], rubric: { points: 10, notes: "Right to erasure, data export, consent tracking, retention policy" } },
      { text: "Explain how you would implement role-based access control (RBAC) in your Express app.", options: [], correctAnswer: null, tags: ["RBAC", "authorization", "middleware"], expectedKeywords: ["role", "middleware", "permissions", "user model", "guard"], rubric: { points: 10, notes: "Role on user model, middleware checks role before controller" } },
      { text: "How would you write integration tests for your Express API endpoints?", options: [], correctAnswer: null, tags: ["testing", "Express", "supertest"], expectedKeywords: ["supertest", "Jest", "mock", "test DB", "assertion"], rubric: { points: 10, notes: "Supertest + Jest, separate test DB, mock external services" } },
      { text: "How does your backend handle concurrent requests modifying the same document in MongoDB?", options: [], correctAnswer: null, tags: ["concurrency", "MongoDB", "race condition"], expectedKeywords: ["findOneAndUpdate", "atomic", "versioning", "race condition", "transaction"], rubric: { points: 10, notes: "Atomic operators, optimistic locking, MongoDB transactions" } },
      { text: "How would you implement API versioning in your existing Express backend?", options: [], correctAnswer: null, tags: ["API versioning", "Express", "maintenance"], expectedKeywords: ["v1", "router", "URL", "header", "backward compatible"], rubric: { points: 10, notes: "URL prefix /v1, separate routers, deprecation strategy" } },
      { text: "Describe how you structured your Express project. Why did you make those architectural choices?", options: [], correctAnswer: null, tags: ["architecture", "Express", "project structure"], expectedKeywords: ["routes", "controllers", "models", "middleware", "separation"], rubric: { points: 10, notes: "MVC structure, separation of concerns, scalability rationale" } },
      { text: "How would you add real-time notifications to your backend project?", options: [], correctAnswer: null, tags: ["real-time", "WebSocket", "notifications"], expectedKeywords: ["WebSocket", "socket.io", "SSE", "event", "push"], rubric: { points: 10, notes: "Socket.io or SSE from server after event, emit to user room" } },
    ],

    "web-dev": [
      { text: "Your resume mentions Node.js and MongoDB. How did you handle schema validation before saving data to the database?", options: [], correctAnswer: null, tags: ["Mongoose", "schema", "validation"], expectedKeywords: ["Mongoose", "schema", "required", "validation", "error handling"], rubric: { points: 10, notes: "Mongoose validators, required fields, error handling" } },
      { text: "You listed JWT authentication in your project. What happens if a JWT token is stolen and how would you mitigate that?", options: [], correctAnswer: null, tags: ["JWT", "security", "tokens"], expectedKeywords: ["expiry", "httpOnly", "refresh token", "blacklist", "XSS"], rubric: { points: 10, notes: "Short expiry, httpOnly cookies, refresh token rotation" } },
      { text: "Walk me through the data flow in your project when a user submits a form — from the browser to the score being stored.", options: [], correctAnswer: null, tags: ["architecture", "data flow", "system design"], expectedKeywords: ["FormData", "axios", "Express", "controller", "MongoDB"], rubric: { points: 10, notes: "Browser → axios → Express route → controller → DB" } },
      { text: "Your project uses an AI API. What prompt engineering techniques did you apply to ensure consistent output?", options: [], correctAnswer: null, tags: ["AI", "prompt engineering", "API"], expectedKeywords: ["prompt", "JSON", "context", "role", "structured output"], rubric: { points: 10, notes: "Role prompting, structured output, deduplication" } },
      { text: "How did you design your MongoDB schema for the main entity in your project? What were your design choices?", options: [], correctAnswer: null, tags: ["MongoDB", "schema design"], expectedKeywords: ["embed", "reference", "index", "relationship", "subdocument"], rubric: { points: 10, notes: "References vs embedding, indexing, trade-offs" } },
      { text: "Your resume mentions React on the frontend. How did you manage state across a complex multi-step UI?", options: [], correctAnswer: null, tags: ["React", "state management", "useState"], expectedKeywords: ["useState", "useRef", "useEffect", "context", "reducer"], rubric: { points: 10, notes: "Multiple useState, useRef for DOM/timers, useEffect cleanup" } },
      { text: "How did you handle API errors on both the frontend and backend in your project?", options: [], correctAnswer: null, tags: ["error handling", "fullstack", "UX"], expectedKeywords: ["try catch", "error state", "toast", "status codes", "next(err)"], rubric: { points: 10, notes: "Backend: global error middleware; Frontend: error state + user feedback" } },
      { text: "Describe the scoring or evaluation mechanism in your project. How did you ensure consistency?", options: [], correctAnswer: null, tags: ["scoring", "consistency", "design"], expectedKeywords: ["rubric", "prompt", "range", "validation", "structured"], rubric: { points: 10, notes: "Structured prompt, defined score bands, output validation" } },
      { text: "If you were to scale this application to 10,000 concurrent users, what would you change first?", options: [], correctAnswer: null, tags: ["scalability", "system design", "architecture"], expectedKeywords: ["load balancer", "queue", "Redis", "horizontal scaling", "rate limit"], rubric: { points: 10, notes: "Queue for async work, horizontal scaling, Redis caching, DB indexes" } },
      { text: "Walk me through your MongoDB schema for the Session or main state-tracking model. Why did you make those design choices?", options: [], correctAnswer: null, tags: ["MongoDB", "schema", "state tracking"], expectedKeywords: ["status", "index", "reference", "currentIndex", "enum"], rubric: { points: 10, notes: "References vs embedding, status enum, index strategy" } },
      { text: "How did you implement a timer or time-based feature in your React frontend?", options: [], correctAnswer: null, tags: ["timer", "React", "useEffect"], expectedKeywords: ["setTimeout", "setInterval", "useEffect", "useRef", "cleanup"], rubric: { points: 10, notes: "useEffect with setInterval, useRef for interval ID, cleanup on unmount" } },
      { text: "How did you determine which rounds or stages are complete vs pending in your project's UI?", options: [], correctAnswer: null, tags: ["status", "frontend", "UX"], expectedKeywords: ["status", "API call", "completed", "pending", "conditional render"], rubric: { points: 10, notes: "API returns status per entity, frontend conditionally renders CTAs" } },
      { text: "How would you add a retry mechanism if a third-party API call fails in your backend?", options: [], correctAnswer: null, tags: ["error handling", "retry", "resilience"], expectedKeywords: ["retry", "exponential backoff", "try catch", "fallback", "timeout"], rubric: { points: 10, notes: "Exponential backoff, max retries, fallback response" } },
      { text: "Your project stores user-generated data. What security risks did you consider and how did you address them?", options: [], correctAnswer: null, tags: ["security", "file upload", "data"], expectedKeywords: ["MIME type", "file size limit", "sanitize", "XSS", "injection"], rubric: { points: 10, notes: "MIME validation, size limits, input sanitization, XSS prevention" } },
      { text: "Describe how you would implement a replay or history feature for past user sessions in your project.", options: [], correctAnswer: null, tags: ["history", "frontend", "React"], expectedKeywords: ["API call", "render", "list", "navigate", "report"], rubric: { points: 10, notes: "GET endpoint for session history, list UI, drill-down to detail" } },
      { text: "How does user-specific data get linked across your data models in the project?", options: [], correctAnswer: null, tags: ["data model", "references", "userId"], expectedKeywords: ["userId", "reference", "populate", "foreign key", "ObjectId"], rubric: { points: 10, notes: "userId reference on all entities, populate or aggregate for reports" } },
      { text: "What changes would you make to support multiple users working on the same entity simultaneously?", options: [], correctAnswer: null, tags: ["concurrency", "multi-user", "system design"], expectedKeywords: ["session isolation", "userId", "atomic", "race condition", "locking"], rubric: { points: 10, notes: "Atomic DB operations, optimistic locking, per-user isolation" } },
      { text: "Explain a complex piece of business logic in your backend. How did you structure and test it?", options: [], correctAnswer: null, tags: ["business logic", "testing", "backend"], expectedKeywords: ["controller", "service", "test", "edge case", "unit test"], rubric: { points: 10, notes: "Separation into service layer, unit tests with mocks" } },
      { text: "How would you add real-time feedback to your application — for example, live score updates?", options: [], correctAnswer: null, tags: ["real-time", "WebSocket", "React"], expectedKeywords: ["WebSocket", "socket.io", "SSE", "event", "useEffect"], rubric: { points: 10, notes: "Socket.io or SSE, emit event after processing, React listener" } },
      { text: "What would you monitor in production to ensure your full-stack app is healthy?", options: [], correctAnswer: null, tags: ["monitoring", "production", "DevOps"], expectedKeywords: ["uptime", "error rate", "latency", "logs", "alerts"], rubric: { points: 10, notes: "Uptime checks, error rate alerts, p95 latency, structured logs" } },
    ], 
    "devops": technical2_devops, 
    "ml": technical2_ml
  },
  // ── HR (domain-agnostic) ────────────────────────────────────────────────
  hr: [
    { text: "Tell me about yourself and what led you to pursue software development.", options: [], correctAnswer: null, tags: ["introduction", "background"], expectedKeywords: ["passion", "project", "learning", "goal"], rubric: { points: 10, notes: "Structured: background, interest, project, future" } },
    { text: "Describe a time you worked in a team and faced a conflict. How did you resolve it?", options: [], correctAnswer: null, tags: ["teamwork", "conflict resolution"], expectedKeywords: ["communication", "listen", "compromise", "outcome"], rubric: { points: 10, notes: "STAR format, positive resolution, learning" } },
    { text: "What is your greatest technical weakness and how are you working to improve it?", options: [], correctAnswer: null, tags: ["self-awareness", "growth"], expectedKeywords: ["weakness", "learning", "improving", "resources"], rubric: { points: 10, notes: "Honest weakness + concrete improvement plan" } },
    { text: "Where do you see yourself in 3 years?", options: [], correctAnswer: null, tags: ["career goals", "ambition"], expectedKeywords: ["growth", "skills", "contribute", "role"], rubric: { points: 10, notes: "Realistic, ambitious, aligned with company" } },
    { text: "Why should we hire you over other candidates?", options: [], correctAnswer: null, tags: ["value proposition", "confidence"], expectedKeywords: ["skills", "project", "learning", "unique"], rubric: { points: 10, notes: "Specific differentiators, not generic answers" } },
    { text: "How do you handle tight deadlines and pressure? Give a specific example.", options: [], correctAnswer: null, tags: ["pressure", "time management"], expectedKeywords: ["prioritise", "deadline", "calm", "delivered"], rubric: { points: 10, notes: "STAR format, concrete outcome" } },
    { text: "Tell me about a project you are most proud of and why.", options: [], correctAnswer: null, tags: ["project", "pride", "achievement"], expectedKeywords: ["built", "challenge", "learned", "impact"], rubric: { points: 10, notes: "Technical depth + personal growth + impact" } },
    { text: "How do you stay updated with the latest technologies in your field?", options: [], correctAnswer: null, tags: ["learning", "growth mindset"], expectedKeywords: ["blogs", "GitHub", "courses", "community"], rubric: { points: 10, notes: "Specific sources, not just 'I Google things'" } },
    { text: "Describe your ideal work environment and team culture.", options: [], correctAnswer: null, tags: ["culture fit", "work style"], expectedKeywords: ["collaborative", "feedback", "growth", "autonomy"], rubric: { points: 10, notes: "Matches company values, shows self-awareness" } },
    { text: "Do you have any questions for us?", options: [], correctAnswer: null, tags: ["engagement", "curiosity"], expectedKeywords: ["team", "growth", "product", "culture"], rubric: { points: 10, notes: "Shows genuine interest" } },
    { text: "Describe a situation where you had to learn a new technology quickly under pressure.", options: [], correctAnswer: null, tags: ["adaptability", "learning"], expectedKeywords: ["deadline", "learned", "documentation", "outcome", "challenge"], rubric: { points: 10, notes: "STAR format, specific tech, positive result" } },
    { text: "How do you prioritise tasks when everything seems urgent?", options: [], correctAnswer: null, tags: ["prioritisation", "time management"], expectedKeywords: ["prioritise", "impact", "deadline", "communicate", "framework"], rubric: { points: 10, notes: "Eisenhower matrix or similar, communicate with stakeholders" } },
    { text: "Tell me about a time you received critical feedback. How did you respond?", options: [], correctAnswer: null, tags: ["feedback", "growth"], expectedKeywords: ["feedback", "improved", "listen", "action", "outcome"], rubric: { points: 10, notes: "STAR, receptive attitude, concrete change made" } },
    { text: "Why do you want to work at this company specifically?", options: [], correctAnswer: null, tags: ["motivation", "company research"], expectedKeywords: ["research", "product", "values", "team", "mission"], rubric: { points: 10, notes: "Shows research, not generic 'good company'" } },
    { text: "How do you approach debugging a complex issue you've never seen before?", options: [], correctAnswer: null, tags: ["debugging", "problem solving"], expectedKeywords: ["isolate", "logs", "reproduce", "stack trace", "systematic"], rubric: { points: 10, notes: "Systematic: reproduce → isolate → logs → hypothesise → test" } },
    { text: "Describe a time you failed at something. What did you learn from it?", options: [], correctAnswer: null, tags: ["failure", "learning", "resilience"], expectedKeywords: ["failed", "learned", "improved", "honest", "outcome"], rubric: { points: 10, notes: "Genuine failure, honest reflection, clear learning" } },
    { text: "How do you ensure the quality of your code before submitting a pull request?", options: [], correctAnswer: null, tags: ["code quality", "process"], expectedKeywords: ["review", "tests", "lint", "edge cases", "documentation"], rubric: { points: 10, notes: "Self-review, tests, linting, peer review process" } },
    { text: "What motivates you to write clean, maintainable code even under deadline pressure?", options: [], correctAnswer: null, tags: ["motivation", "code quality"], expectedKeywords: ["maintainability", "team", "future", "debt", "pride"], rubric: { points: 10, notes: "Long-term thinking, team impact, technical debt awareness" } },
    { text: "How would you handle a situation where you strongly disagree with your team lead's technical decision?", options: [], correctAnswer: null, tags: ["conflict", "leadership", "communication"], expectedKeywords: ["communicate", "data", "respect", "escalate", "compromise"], rubric: { points: 10, notes: "Raise concern professionally with data, then commit to decision" } },
    { text: "Where do you draw inspiration for solving difficult engineering problems?", options: [], correctAnswer: null, tags: ["creativity", "problem solving"], expectedKeywords: ["peers", "papers", "open source", "design patterns", "mentors"], rubric: { points: 10, notes: "Specific sources: OSS, papers, communities, mentors" } },
  ],
};

// ── Static scores (20 per section) ────────────────────────────────────────
const STATIC_SCORES = {
  aptitude:   [100, 100, 100, 0, 100, 100, 100, 0, 100, 100, 0, 100, 100, 100, 0, 100, 100, 0, 100, 100],
  technical1: [88, 92, 95, 85, 90, 87, 82, 88, 78, 91, 86, 93, 80, 89, 84, 91, 77, 88, 82, 90],
  technical2: [90, 87, 93, 85, 88, 84, 91, 80, 86, 89, 92, 83, 87, 90, 85, 88, 81, 93, 86, 89],
  hr:         [85, 88, 82, 90, 86, 84, 92, 80, 85, 88, 83, 91, 87, 84, 89, 82, 86, 88, 90, 85],
  coding:     [88, 92, 85, 90, 78, 95, 82, 88, 96, 80, 91, 84, 87, 93, 79, 88, 86, 90, 83, 92],
};

// ── Static transcripts (20 per section, domain-agnostic for now) ──────────
const STATIC_TRANSCRIPTS = {
  technical1: [
    "SQL databases use structured tables with defined schemas and are ideal for relational data with complex joins. NoSQL databases like MongoDB store flexible documents and scale horizontally. I would choose SQL for banking or e-commerce where ACID guarantees matter, and NoSQL for apps needing flexible schemas like social feeds.",
    "REST stands for Representational State Transfer. Key principles are statelessness where each request carries all needed info, use of standard HTTP methods, resource-based URLs, and consistent JSON responses with proper status codes like 200, 404, and 500.",
    "Middleware functions run between the incoming request and the outgoing response. They have access to req, res, and the next function. We use them for authentication, logging, and error handling. I wrote an auth middleware that verifies the JWT token on every protected route before the controller runs.",
    "Indexing creates a separate data structure pointing to rows in the table, making reads much faster. The trade-off is that every write must also update the index, so write performance drops slightly. You add indexes on columns you frequently filter or sort by.",
    "The event loop allows Node.js to perform non-blocking I/O despite being single-threaded. When an async operation completes its callback is pushed to the task queue. The event loop picks callbacks when the call stack is empty. This is why Node is efficient for I/O-heavy workloads.",
    "Authentication verifies who you are while authorisation controls what you are allowed to do. For JWT we sign a payload with a secret key on login and send it to the client. On each subsequent request the middleware verifies the signature and extracts the user ID from the token.",
    "MVC separates concerns into Model for data and business logic, View for the UI, and Controller for handling requests. In our Express backend controllers handle HTTP requests, Mongoose models define the schemas, and routes connect them. This separation makes each layer independently testable.",
    "A process has its own memory space while threads share memory within a process. Node.js is single-threaded but uses the event loop and libuv's thread pool for async operations. For CPU-intensive tasks you would use worker threads or cluster mode to spawn multiple processes.",
    "HTTPS uses TLS. The client sends a hello, the server responds with its certificate, the client verifies it against a CA, then both parties agree on a symmetric session key using asymmetric encryption. All further communication uses that faster symmetric key.",
    "First normal form requires atomic values and no repeating groups. Second normal form removes partial dependencies on composite keys. Third normal form removes transitive dependencies where a non-key column depends on another non-key column. Each step reduces redundancy and improves data integrity.",
    "Synchronous code blocks execution until it completes. Asynchronous code uses callbacks, Promises, or async/await to continue execution while waiting. Reading a file synchronously halts the thread while the async version lets Node handle other requests during the I/O wait.",
    "Microservices break an application into small independent services each responsible for one business function. Unlike a monolith where everything deploys together, microservices deploy independently. This improves scalability and fault isolation but adds operational complexity.",
    "A CDN is a network of edge servers distributed globally that cache static assets close to users. Instead of every request hitting the origin server, users fetch from the nearest edge node. This dramatically reduces latency for images, CSS, and JavaScript files.",
    "A rate limiter controls how many requests a client can make in a time window. I would use a token bucket algorithm where each client gets a fixed number of tokens per minute. In a distributed system I would track counts in Redis with expiring keys per client.",
    "WebSockets provide a persistent bidirectional connection unlike HTTP which is request-response only. Once the connection is upgraded both sides can push messages at any time. This is ideal for chat apps, live dashboards, and collaborative tools.",
    "The CAP theorem states a distributed system can guarantee at most two of Consistency, Availability, and Partition Tolerance. Since network partitions are unavoidable, most systems choose between CP like MongoDB and AP like Cassandra based on their consistency requirements.",
    "Caching stores frequently accessed data in fast memory to avoid expensive recomputation or database queries. Common strategies include LRU eviction to remove least recently used entries, write-through where every write goes to both cache and DB, and TTL-based expiration.",
    "In Express I use try-catch blocks in async controllers and pass errors to a global error middleware using next of err. This middleware logs the error, checks its type, and sends an appropriate HTTP status code and message back to the client.",
    "Vertical scaling means upgrading a single server with more CPU or RAM. It has a ceiling and is a single point of failure. Horizontal scaling adds more server instances behind a load balancer. It is more resilient and scales better for distributed workloads with many concurrent users.",
    "An idempotent operation returns the same result no matter how many times it is called. GET, PUT, and DELETE are idempotent in REST while POST is not because it creates new resources. Idempotency is critical for retry logic so network timeouts do not create duplicate records.",
  ],
  technical2: [
    "We used Mongoose which lets us define schemas with typed fields and required constraints. For example our Session model required userId, domain, and level. If any field was missing Mongoose threw a validation error before the DB write so we never stored incomplete records.",
    "JWTs are stateless so we cannot invalidate them server-side directly. Best practice is to keep expiry short, store them in httpOnly cookies to prevent XSS, and implement refresh token rotation. For production I would add a Redis-backed token blacklist for immediate revocation.",
    "The user submits the form, the browser sends a POST with the payload. Express receives it, the middleware validates auth, the controller runs business logic, the model saves to MongoDB, and the response is sent back. Every step has error handling to prevent silent failures.",
    "We used role prompting to tell the AI it is an expert interviewer. We passed the domain and experience level as context, included previous question texts to avoid repetition, and required structured JSON output only. This combination made outputs consistent and parseable.",
    "The main model has a rounds array as a subdocument. Each round has a section, label, sessionId reference, status, and score fields. When a round completes we query all its answers, compute the average, and update that subdocument atomically using findOneAndUpdate.",
    "Before generating each question we query all existing question documents in the current session using their stored IDs. We extract the text field from each and inject that array into the AI prompt instructing it to avoid repeating those topics.",
    "We used multiple useState hooks for the current item, index, section, time remaining, recording state, and score. The MediaRecorder reference and timer ID were stored in useRef to avoid stale closure issues. useEffect handled the countdown and cleanup on component unmount.",
    "We wrapped the getUserMedia call in a try catch block. If it throws a NotAllowedError we set an error state that renders a clear message telling the user to grant microphone permission in browser settings. All recording buttons are disabled until permission is granted.",
    "The scoring prompt defines clear score bands: 90 to 100 for excellent, 70 to 89 for good, 40 to 69 for average, and 1 to 39 for poor. We instruct the model to return only a single integer and use a regex to extract it from the response as a safety net.",
    "First I would add a message queue like Bull with Redis so submissions are processed asynchronously instead of blocking the HTTP response. Then horizontal scaling of the Node service behind a load balancer. Database indexes on the most queried fields would come next.",
    "The schema stores question IDs as an array of ObjectId references rather than embedding full questions. I chose references because question documents can be reused and queried independently. The currentIndex field drives the state machine: increment after each answer, compare to TOTAL to detect completion.",
    "When the timer hits zero the useEffect cleanup function triggers. If recording is active we stop it which fires the onstop handler and sets the audio blob. We then immediately call the submit function with an auto flag so the session advances even if the blob is empty.",
    "The detail page calls GET on the main entity which returns all child entities with their status fields. The frontend maps over these and conditionally renders a Start button for pending items, a Continue button for in-progress, and a View Report link for completed ones.",
    "I would wrap the API call in a retry loop with exponential backoff. First attempt immediately, second after one second, third after two seconds, up to three retries. If all fail I fall back to a default value rather than blocking the user session from progressing.",
    "The main risks are malicious file content and unauthorized access. I validate MIME type on the server, enforce a max file size via multer options, store files in S3 instead of local disk, and generate short-lived presigned URLs for access rather than exposing raw paths.",
    "I would store the file in S3 after upload and save the S3 key in the document. On the detail page I would call a backend endpoint that generates a presigned URL returned to the frontend. A React audio or video element with that URL as the src handles playback.",
    "When the user uploads a resume it is parsed and the text is stored on the parent document. When generating section-specific questions the backend fetches that parent, extracts the resume text, and injects it into the AI prompt so questions reference actual projects and technologies.",
    "Sessions are already isolated by userId so data separation is handled. The main concern is concurrent writes to the same parent document when multiple child processes complete simultaneously. I would use MongoDB atomic operators like findOneAndUpdate to prevent race conditions.",
    "The index field starts at zero and increments by one after each answer. The controller checks if it is greater than or equal to the total count and marks the entity completed. If the question ID at that index is undefined the entity is also marked complete as a safety guard.",
    "I would implement Socket.io on the backend. When a score is computed the server emits an event with the ID and score to the user's socket room. The frontend listens for this event and updates the UI in real time without polling, giving immediate feedback.",
  ],
  hr: [
    "I am a final year computer science student with a strong interest in backend development. I got into coding through building small web projects and quickly became fascinated by how servers and databases work. My most significant project is an AI-powered platform I built end to end with my team.",
    "During our college project one teammate wanted to use Firebase while I preferred MongoDB. Instead of arguing we listed the pros and cons for our specific use case. We needed complex queries so MongoDB made more sense. Open communication and focusing on project goals resolved it.",
    "My greatest weakness is that I sometimes spend too long perfecting one part of the code before moving on. I have been working on this by setting time-boxed sprints and doing code reviews with teammates early rather than only when something is finished.",
    "In three years I see myself as a confident full-stack developer who has shipped real products to real users. I want to go deeper into system design and distributed systems, and eventually mentor junior developers and contribute to open source.",
    "I bring practical project experience, genuine curiosity for how things work under the hood, and the ability to learn quickly. Unlike candidates who have only done tutorials, I have built and deployed a full-stack application with AI integration from scratch.",
    "During our semester project we had a hard deadline for the college demo. Two days before, our AI integration broke because of an API change. I stayed calm, prioritised fixing the core flow first, and had it working by the next morning. We presented successfully.",
    "I am most proud of the AI-powered project I built. The voice recording and transcription pipeline was genuinely challenging. Getting the AI to return consistent structured scores required a lot of prompt iteration. Seeing it work end to end is very satisfying.",
    "I follow engineering blogs, official changelogs for tools I use, and I watch conference talks on YouTube. I also try to build small side projects whenever I learn something new because reading without building does not stick for me.",
    "I thrive in collaborative environments where feedback is given openly and early. I like teams where people ask questions without fear of judgment and where there is a culture of learning from mistakes rather than blame. Autonomy with clear goals works very well for me.",
    "Yes absolutely. What does the onboarding process look like for a fresher joining the team, and what does growth look like in the first year here?",
    "During an internship I was asked to build a feature using PostgreSQL which I had never used professionally. I spent the first evening going through the official docs and building a small test project. Within two days I had the feature working. Treating it as a puzzle rather than a threat made the difference.",
    "I categorise tasks by impact and urgency. If something blocks the rest of the team it goes first. I also communicate proactively when deadlines are at risk instead of waiting until it is too late. This transparency lets the team adjust before things become critical.",
    "A senior engineer reviewed my code and said it worked but was difficult to follow. Initially I was defensive but looking at their suggestions I realised they were right. I rewrote the module with clearer names and smaller functions. Since then I always ask for feedback early.",
    "I have been following the company's engineering blog and I am genuinely excited about the work your team is doing. I also want to work somewhere that cares about developer experience as much as the product experience, which matches what I have read about your culture.",
    "When I encounter a bug I try to reproduce it reliably first. Then I isolate which layer is responsible, frontend, API, or database. I read logs carefully, form a hypothesis, test it, and repeat. I also search GitHub issues and Stack Overflow for similar error signatures.",
    "During my third semester I misjudged the time needed for a data structures assignment and submitted a half-finished solution. The lesson was clear: break large tasks into small milestones and check progress daily. I have not missed a deadline since.",
    "Before every PR I do a self-review reading the diff line by line as if I were a reviewer unfamiliar with the context. I check edge cases, ensure functions do one thing each, and verify I have manually tested the happy path and at least one error path.",
    "Writing clean code saves the team time in the long run. When I revisit code I wrote months ago I want to understand it immediately. Sloppy code under deadline creates technical debt that compounds and slows future features. Good habits now prevent firefighting later.",
    "I would raise my concern privately with clear reasoning and data if I had it. Silent disagreement helps no one so I speak up. But once the team makes a decision I commit to it fully. I have learned that sometimes my lead sees constraints I am not aware of.",
    "I get a lot of inspiration from reading open-source code on GitHub. Seeing how experienced engineers structure large codebases is incredibly educational. I also follow engineers I respect on Substack. A single well-written blog post can completely reframe how I approach a problem.",
  ],
  coding: [
    "I would use a two-pointer approach. Start one pointer at the beginning and one at the end, swap the characters, then move them toward each other until they meet. Time complexity is O of n and space is O of 1 if done in place.",
    "The optimal solution uses a hash map. For each number I compute the complement which is target minus current. If the complement exists in the map I return the pair. Otherwise I store the current number. This gives O of n time and space.",
    "A stack is LIFO, last in first out, useful for undo operations and bracket matching. A queue is FIFO, first in first out, useful for task scheduling and BFS graph traversal. The choice depends on whether you need to process the most recent or the oldest item first.",
    "A closure is a function that retains access to its outer scope even after the outer function returns. A classic example is a counter factory where each call creates a fresh count variable and returns a function that increments it. The inner function closes over count.",
    "Floyd's cycle detection uses two pointers, slow moves one step and fast moves two. If there is a cycle they eventually meet. If fast reaches null there is no cycle. Once they meet you can find the cycle start by moving one pointer to the head and advancing both one step at a time.",
    "Binary search runs in O of log n time because it halves the search space each time. Space is O of 1 for the iterative version. It only works on sorted arrays. Pick the midpoint, compare to target, discard the half that cannot contain the target.",
    "Recursion is when a function calls itself. The base case stops recursion and the recursive case moves toward it. The risk is stack overflow if the base case is never reached. Memoization can help by caching subproblem results so each value is computed only once.",
    "Event delegation attaches one listener on a parent rather than each child. Events bubble up to the parent where you check event.target to identify the source. This is memory efficient and automatically handles dynamically added child elements.",
    "Double equals coerces types before comparing so 0 equals false is true. Triple equals checks both type and value so 0 equals false is false because one is a number and the other is a boolean. I always use triple equals to avoid unexpected coercion.",
    "An LRU cache needs O of 1 get and put. I combine a HashMap with a doubly linked list. The map holds key to node references, the list maintains recency from head to tail. On access I move the node to the head. When capacity is exceeded I evict from the tail.",
    "A shallow copy copies top-level properties but nested objects still share references. A deep copy recursively duplicates everything. In JavaScript you can use structuredClone for a proper deep copy or JSON parse stringify for simple objects without functions or dates.",
    "Kadane's algorithm maintains currentMax and globalMax. At each element you choose between extending the previous subarray or starting fresh. If currentMax becomes negative you reset it to zero. GlobalMax tracks the best subarray sum seen so far. Time complexity is O of n.",
    "Memoization caches the results of expensive function calls. The classic example is Fibonacci. Without memoization recursive Fibonacci is O of 2 to the n. With a memo object it becomes O of n because each value is computed only once and looked up subsequently.",
    "Convert to lowercase and strip non-alphanumeric characters. Use two pointers from each end comparing inward. If all pairs match it is a palindrome. Edge cases are empty string which returns true and single characters which are always palindromes.",
    "Call and apply both invoke a function immediately with a specific this context. Call takes arguments individually while apply takes them as an array. Bind returns a new permanently bound function without invoking it immediately, useful for event handlers and callbacks.",
    "Hash table average operations are O of 1 for get, set, and delete. In the worst case if many keys hash to the same bucket operations degrade to O of n. A good hash function and load factor management through rehashing keep performance close to O of 1.",
    "To find all permutations I use backtracking. Fix one character at each position by swapping it with every character from that position onward, recurse on the remaining string. When the index reaches the end add the current arrangement to results. Time is O of n factorial.",
    "Every JavaScript object has a prototype property pointing to another object. When you access a property the engine looks on the object first, then walks up the chain until it finds it or hits Object.prototype which is null. This is how methods like toString are inherited.",
    "BFS uses a queue and explores level by level making it ideal for shortest path in unweighted graphs. DFS uses a stack or recursion and goes deep first, useful for topological sort and cycle detection. BFS uses more memory for wide graphs, DFS for very deep ones.",
    "var is function-scoped and hoisted with an initial value of undefined. let and const are block-scoped and hoisted but not initialized, creating a temporal dead zone where accessing them throws a ReferenceError. const additionally cannot be reassigned after declaration.",
  ],
};

// ── Resolve the correct question bank given section + domain ───────────────
const resolveBank = (section, domain = "web-dev") => {
  // aptitude and hr are flat arrays
  if (section === "aptitude" || section === "hr") {
    return STATIC_QUESTIONS[section];
  }
  // technical1, technical2, coding are domain-keyed
  const domainBank = STATIC_QUESTIONS[section];
  if (!domainBank) return STATIC_QUESTIONS.technical1["web-dev"];
  return domainBank[domain] || domainBank["web-dev"] || Object.values(domainBank)[0];
};

// ── Fake AI thinking delay ─────────────────────────────────────────────────
const fakeDelay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// ── Pick a random question index not already used in this session ──────────
export const pickRandomIndex = (bank, usedTexts = []) => {
  const available = bank
    .map((q, i) => ({ q, i }))
    .filter(({ q }) => !usedTexts.includes(q.text));

  if (available.length === 0) {
    return Math.floor(Math.random() * bank.length);
  }

  const pick = available[Math.floor(Math.random() * available.length)];
  return pick.i;
};

// ── generateQuestion ───────────────────────────────────────────────────────
export const generateQuestion = async ({ section, domain = "web-dev", previousQuestions = [] }) => {
  const bank = resolveBank(section, domain);
  const idx  = pickRandomIndex(bank, previousQuestions);
  const q    = bank[idx];

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
    const domain  = session.domain  || "web-dev";

    await fakeDelay(1500 + Math.random() * 1000);

    const bank = resolveBank(section, domain);

    let usedTexts = [];
    if (session.questionIds.length > 0) {
      const existing = await Question.find({ _id: { $in: session.questionIds } }).select("text").lean();
      usedTexts = existing.map((q) => q.text);
    }

    const qIdx    = pickRandomIndex(bank, usedTexts);
    const staticQ = bank[qIdx];

    const question = await Question.create({
      domain,
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

export { STATIC_QUESTIONS, STATIC_SCORES, STATIC_TRANSCRIPTS, pickRandomIndex as default, resolveBank };