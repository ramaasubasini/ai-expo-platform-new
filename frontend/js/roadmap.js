// ═══════════════════════════════════════════════════════
//  DETAILED ROADMAP DATA FOR ALL 31 COURSES
//  Each course has: topics (learning path), duration, prerequisites
// ═══════════════════════════════════════════════════════

const ROADMAP_DATA = {
    "Python": {
        topics: ["Installing Python & IDE Setup","Variables, Data Types & Type Casting","Operators & Expressions","Conditional Statements (if/elif/else)","Loops — for, while, break, continue","Strings — Slicing, Methods, f-strings","Lists, Tuples, Sets, Dictionaries","Functions — Parameters, *args, **kwargs","Lambda, map, filter, reduce","List Comprehensions & Dict Comprehensions","File I/O — Read, Write, Append, CSV, JSON","Exception Handling — try/except/finally","OOP — Classes, Objects, __init__","Inheritance, Polymorphism, Encapsulation","Magic Methods & Dunder Methods","Modules, Packages & pip","Iterators & Generators (yield)","Decorators & Closures","Context Managers (with statement)","Regular Expressions (re module)","Virtual Environments & Requirements.txt","Unit Testing with unittest & pytest","Logging & Debugging Techniques","Working with APIs (requests library)","Multithreading & Multiprocessing","Async Programming (asyncio, await)","Database Access with sqlite3","Web Scraping with BeautifulSoup","Data Analysis Intro (Pandas basics)","Build a Complete CLI Automation Tool"],
        duration: "10-14 Weeks",
        prereqs: "None — Perfect for absolute beginners"
    },
    "Java": {
        topics: ["JDK/JRE Setup & IDE Configuration","Hello World & Program Structure","Primitive Data Types & Variables","Operators, Casting & Scanner Input","Control Flow — if, switch, ternary","Loops — for, while, do-while, for-each","Arrays — 1D, 2D, Jagged Arrays","Strings — StringBuilder, StringBuffer","Methods, Overloading & Recursion","OOP — Classes, Objects, Constructors","Encapsulation & Access Modifiers","Inheritance & Method Overriding","Polymorphism — Static vs Dynamic","Abstract Classes & Interfaces","Packages & Import Mechanism","Exception Handling — try/catch/throw/throws","Custom Exceptions","Collections — ArrayList, LinkedList, HashMap, TreeMap, HashSet","Iterators & Comparable/Comparator","Generics & Wildcards","File I/O with Streams (InputStream, BufferedReader)","Serialization & Deserialization","Multithreading — Thread, Runnable, synchronized","Lambda Expressions & Functional Interfaces","Stream API — filter, map, collect, reduce","JDBC — Connecting to MySQL/PostgreSQL","Enums, Annotations & Reflection","Design Patterns in Java","Maven/Gradle Build Tools","Build a Full Banking Console Application"],
        duration: "12-16 Weeks",
        prereqs: "Basic programming logic"
    },
    "C": {
        topics: ["GCC Compiler Setup & Hello World","Variables, Constants & Data Types","Operators — Arithmetic, Logical, Bitwise","printf/scanf & Format Specifiers","Decision Making — if, else if, switch","Loops — for, while, do-while, nested","Functions — Declaration, Definition, Prototypes","Recursion & Recursive Problem Solving","Storage Classes — auto, static, extern, register","Arrays — 1D, 2D, Multi-dimensional","Strings — char arrays, string.h functions","Pointers — Declaration, Dereferencing, Arithmetic","Pointer to Pointer & Pointer to Array","Dynamic Memory — malloc, calloc, realloc, free","Structures — Definition, Nested, Array of Structures","Unions & Enumerations","Typedef & Macros","Preprocessor Directives (#define, #include, #ifdef)","File Handling — fopen, fread, fwrite, fprintf","Command Line Arguments","Bit Manipulation Techniques","Linked List Implementation in C","Stack & Queue in C","Memory Leaks & Debugging with Valgrind","Build a Student Record Management System"],
        duration: "8-12 Weeks",
        prereqs: "None — Foundational language"
    },
    "C++": {
        topics: ["C++ vs C — New Features Overview","Namespaces & iostream (cin/cout)","References vs Pointers","Default Arguments & Function Overloading","OOP — Classes, Objects, this pointer","Constructors — Default, Parameterized, Copy","Destructor & Resource Management","Encapsulation & Friend Functions","Inheritance — Single, Multiple, Virtual","Polymorphism — Virtual Functions, vtable","Operator Overloading (binary, unary, stream)","Abstract Classes & Pure Virtual Functions","Templates — Function & Class Templates","Template Specialization","STL — vector, list, deque, stack, queue","STL — map, set, unordered_map, multiset","STL Algorithms — sort, find, binary_search, accumulate","Iterators — begin, end, reverse, const","Smart Pointers — unique_ptr, shared_ptr, weak_ptr","RAII Pattern & Move Semantics","Move Constructors & rvalue References","Lambda Expressions in C++","Exception Handling — try, catch, throw","File Streams — ifstream, ofstream, stringstream","Multithreading with std::thread & mutex","Design Patterns — Factory, Observer, Strategy","Memory Management & Debugging","Competitive Programming with C++","Build a Mini Game Engine / Simulation"],
        duration: "12-16 Weeks",
        prereqs: "C language basics"
    },
    "HTML": {
        topics: ["What is HTML & How Browsers Render","Document Structure — doctype, html, head, body","Headings (h1-h6), Paragraphs & Line Breaks","Text Formatting — bold, italic, underline, mark","Links — anchor tags, target, mailto, tel","Images — src, alt, width, height, figure","Ordered, Unordered & Definition Lists","Tables — thead, tbody, tfoot, colspan, rowspan","Forms — input, textarea, select, button","Input Types — text, email, password, number, date, range, file","Form Validation — required, pattern, min, max","Semantic HTML5 — header, nav, main, article, section, footer","Audio & Video Elements","Embedding — iframe, object, embed","SVG Basics & Inline SVG","Canvas Element Introduction","Meta Tags — charset, viewport, description, keywords","Open Graph & Twitter Card Tags","Favicon & Apple Touch Icons","Accessibility — ARIA roles, labels, alt text","HTML Entities & Special Characters","Data Attributes (data-*)","HTML Best Practices & W3C Validation","Build a Complete Multi-Page Portfolio Website"],
        duration: "3-4 Weeks",
        prereqs: "None — Start here for web dev"
    },
    "CSS": {
        topics: ["CSS Syntax, Selectors & How to Link","Color Values — hex, rgb, hsl, opacity","Fonts — font-family, Google Fonts, @font-face","Text Properties — align, transform, spacing, shadow","Box Model — margin, padding, border, box-sizing","Display — block, inline, inline-block, none","Positioning — static, relative, absolute, fixed, sticky","Float, Clear & Overflow","Flexbox — Container & Item Properties","Flexbox Layouts — Navbar, Cards, Footer","CSS Grid — Rows, Columns, Template Areas","Grid Responsive Layouts","Pseudo-Classes — :hover, :focus, :nth-child, :not","Pseudo-Elements — ::before, ::after, ::placeholder","Background — images, gradients, blend-modes","Borders, Border-Radius & Box-Shadow","Transitions — property, duration, timing, delay","Animations — @keyframes, animation properties","Transform — translate, rotate, scale, skew","CSS Variables (Custom Properties)","Media Queries & Responsive Breakpoints","Mobile-First Design Approach","Z-index & Stacking Context","CSS Specificity & Cascade Rules","Glassmorphism, Neumorphism, Dark Mode","CSS Frameworks Overview (Bootstrap, Tailwind)","CSS Preprocessors — SASS/SCSS Basics","Build a Fully Responsive Glassmorphic Dashboard"],
        duration: "4-6 Weeks",
        prereqs: "HTML basics"
    },
    "JavaScript": {
        topics: ["Variables — var, let, const & Hoisting","Data Types — String, Number, Boolean, null, undefined, Symbol","Operators — Arithmetic, Comparison, Logical, Ternary","Type Coercion & Strict Equality (=== vs ==)","Conditionals — if/else, switch, ternary","Loops — for, while, for...in, for...of","Functions — Declaration, Expression, Arrow","Scope — Global, Function, Block, Lexical","Closures & IIFE","Higher-Order Functions — map, filter, reduce, forEach","Objects — Creation, Methods, this keyword","Prototypes & Prototype Chain","ES6 Classes & Inheritance","Destructuring — Arrays & Objects","Spread/Rest Operator","Template Literals & Tagged Templates","DOM Manipulation — querySelector, createElement","Event Handling — addEventListener, Event Object, Bubbling","Event Delegation & Debouncing","Local Storage, Session Storage, Cookies","JSON — parse, stringify","Promises — resolve, reject, .then, .catch","Async/Await & Error Handling","Fetch API & AJAX Requests","Modules — import/export (ES Modules)","Error Handling — try/catch/finally","Regular Expressions in JS","Web APIs — setTimeout, setInterval, Date, Intl","ES2020+ — Optional Chaining, Nullish Coalescing","Build a Full Interactive Single-Page Application"],
        duration: "10-14 Weeks",
        prereqs: "HTML & CSS"
    },
    "React JS": {
        topics: ["React Overview & Virtual DOM Concept","Create React App vs Vite Setup","JSX Syntax & Expressions","Components — Functional vs Class","Props — Passing Data & Children","State — useState Hook","Event Handling in React","Conditional Rendering Patterns","Lists, Keys & Rendering Arrays","Forms — Controlled vs Uncontrolled Components","useEffect — Side Effects & Cleanup","useRef — DOM Access & Persisting Values","useContext — Avoiding Prop Drilling","useReducer — Complex State Logic","useMemo & useCallback — Performance","Custom Hooks — Creating Reusable Logic","React Router — Routes, Link, useNavigate, Params","Nested Routes & Protected Routes","Global State — Context API vs Redux Toolkit","Redux — Store, Actions, Reducers, Middleware","API Integration with Axios/Fetch","Loading States, Error Boundaries","Component Lifecycle Deep Dive","React.memo & Code Splitting (lazy/Suspense)","Styled Components & CSS Modules","Unit Testing with React Testing Library","Deployment — Vercel, Netlify, GitHub Pages","Next.js Introduction & SSR/SSG","Build a Full E-Commerce Application with Auth"],
        duration: "12-16 Weeks",
        prereqs: "JavaScript ES6+"
    },
    "Node JS": {
        topics: ["Node.js Architecture & Event Loop","npm Init, package.json & Scripts","Core Modules — fs, path, os, url, http","CommonJS vs ES Modules (require vs import)","Creating HTTP Servers from Scratch","Handling GET, POST Requests Manually","Streams — Readable, Writable, Transform, Pipe","Buffers & Binary Data","Event Emitter Pattern","File System — readFile, writeFile, watch, mkdir","Environment Variables with dotenv","npm Packages — nodemon, chalk, inquirer","Error Handling Best Practices","Debugging with Node Inspector & VS Code","Child Processes — exec, spawn, fork","Cluster Module for Multi-Core","Worker Threads","Timers — setTimeout, setInterval, setImmediate","Path Module Deep Dive","Crypto Module — Hashing, Encryption","Building a WebSocket Server","Real-time Applications with Socket.io","Task Scheduling with node-cron","Build a Complete Real-time Chat Application"],
        duration: "8-12 Weeks",
        prereqs: "JavaScript"
    },
    "Express JS": {
        topics: ["Express Installation & App Setup","app.get, app.post, app.put, app.delete","Request Object — params, query, body, headers","Response Object — send, json, status, redirect","Middleware — Concept, next(), Custom Middleware","Built-in Middleware — express.json, express.static","Third-party Middleware — cors, helmet, morgan","Router & Route Organization (express.Router)","Route Parameters & Pattern Matching","Serving Static Files & Templates","Template Engines — EJS, Pug, Handlebars","Error Handling Middleware","404 & Global Error Handlers","Cookies — Setting, Reading, Clearing","Sessions — express-session Configuration","Authentication with Passport.js","JWT Authentication Implementation","File Upload with multer","Rate Limiting & Security Best Practices","Input Validation with express-validator","CRUD REST API Design","API Versioning Strategy","MVC Architecture Pattern","Deployment with PM2 & Nginx","Build a Full RESTful Blog API with Auth"],
        duration: "6-8 Weeks",
        prereqs: "Node.js basics"
    },
    "MongoDB": {
        topics: ["NoSQL Concepts vs Relational Databases","MongoDB Atlas Cloud Setup & Compass GUI","Documents, Collections & Databases","Data Types — String, Number, Boolean, Date, ObjectId, Array","insertOne, insertMany","find, findOne with Projections","Comparison Operators — $eq, $gt, $lt, $in, $nin","Logical Operators — $and, $or, $not, $nor","Update — updateOne, updateMany, $set, $inc, $push, $pull","Delete — deleteOne, deleteMany","Sorting, Limiting, Skipping & Counting","Indexing — Single, Compound, Text, TTL","Aggregation Pipeline — $match, $group, $sort, $project","$lookup (Join), $unwind, $addFields","Text Search & Regular Expression Queries","Schema Validation Rules","Mongoose ODM — Schema, Model, Validation","Mongoose — Middleware (pre/post hooks)","Mongoose — Population & References","Mongoose — Virtual Fields & Statics","Transactions & Atomicity","Replication & Replica Sets","Sharding Concepts","MongoDB Security — Authentication & Roles","Build a User Management System with Mongoose"],
        duration: "6-8 Weeks",
        prereqs: "Basic JSON understanding"
    },
    "SQL": {
        topics: ["Relational Database Concepts & RDBMS","Installing MySQL/PostgreSQL","CREATE DATABASE, CREATE TABLE","Data Types — INT, VARCHAR, DATE, DECIMAL, BOOLEAN","INSERT INTO — Single & Multiple Rows","SELECT — Columns, Aliases, DISTINCT","WHERE — Operators, AND, OR, NOT, BETWEEN, LIKE, IN","ORDER BY, LIMIT, OFFSET","UPDATE & DELETE Statements","ALTER TABLE — ADD, DROP, MODIFY Columns","PRIMARY KEY, FOREIGN KEY, UNIQUE, CHECK, DEFAULT","AUTO_INCREMENT / SERIAL","INNER JOIN, LEFT JOIN, RIGHT JOIN, FULL OUTER JOIN","Self Join & Cross Join","GROUP BY, HAVING, Aggregate Functions (SUM, AVG, COUNT, MIN, MAX)","Subqueries — Scalar, Row, Table","Correlated Subqueries","UNION, INTERSECT, EXCEPT","Views — CREATE, ALTER, DROP","Indexes — Clustered, Non-Clustered, Composite","Stored Procedures & Functions","Triggers — BEFORE, AFTER, INSTEAD OF","Transactions — BEGIN, COMMIT, ROLLBACK, SAVEPOINT","ACID Properties Deep Dive","Normalization — 1NF, 2NF, 3NF, BCNF","Denormalization & When to Use It","Query Optimization & EXPLAIN","Window Functions — ROW_NUMBER, RANK, LEAD, LAG","Database Backup & Recovery","Build a Complete Inventory Management Database"],
        duration: "6-8 Weeks",
        prereqs: "None"
    },
    "Data Structures": {
        topics: ["Time Complexity — Big O, Omega, Theta","Space Complexity Analysis","Arrays — Static vs Dynamic, Operations","Two Pointer Technique on Arrays","Sliding Window Technique","Singly Linked List — Insert, Delete, Reverse","Doubly Linked List & Circular Linked List","Stacks — Array & Linked List Implementation","Stack Applications — Balanced Parentheses, Postfix","Queues — Simple, Circular, Priority Queue","Deque (Double-ended Queue)","Hash Tables — Hashing Functions, Collision Handling","Hash Maps — Chaining vs Open Addressing","Binary Trees — Traversals (Inorder, Preorder, Postorder, Level)","Binary Search Trees — Insert, Delete, Search","AVL Trees — Rotations & Balancing","Red-Black Trees Concepts","Heaps — Min Heap, Max Heap, Heapify","Priority Queue with Heaps","Graphs — Adjacency Matrix vs Adjacency List","BFS (Breadth-First Search)","DFS (Depth-First Search)","Topological Sorting","Shortest Path — Dijkstra, Bellman-Ford","Minimum Spanning Tree — Prim, Kruskal","Tries — Insert, Search, Prefix Matching","Disjoint Set (Union-Find)","Segment Trees & Fenwick Trees","Bloom Filters & Skip Lists","Solve 100+ LeetCode DSA Problems"],
        duration: "14-18 Weeks",
        prereqs: "Any programming language"
    },
    "Algorithms": {
        topics: ["Algorithm Analysis Recap — Big O Notation","Bubble Sort, Selection Sort, Insertion Sort","Merge Sort — Divide & Conquer","Quick Sort — Partitioning Strategies","Heap Sort & Counting Sort","Radix Sort & Bucket Sort","Binary Search — Classic & Variations","Search in Rotated Sorted Array","Recursion — Base Cases & Call Stack","Backtracking — N-Queens, Sudoku Solver, Permutations","Divide & Conquer — Maximum Subarray, Closest Pair","Greedy Algorithms — Activity Selection, Huffman Coding","Greedy — Fractional Knapsack, Job Sequencing","Dynamic Programming — Memoization vs Tabulation","DP — Fibonacci, Climbing Stairs, Coin Change","DP — Longest Common Subsequence, Edit Distance","DP — 0/1 Knapsack, Subset Sum","DP — Matrix Chain Multiplication","DP on Trees & DP on Graphs","Graph — BFS, DFS Applications","Graph — Dijkstra, Floyd-Warshall, Bellman-Ford","Graph — Topological Sort, Cycle Detection","Graph — Strongly Connected Components (Tarjan, Kosaraju)","Minimum Spanning Tree — Prim, Kruskal","Network Flow — Ford-Fulkerson","String Matching — KMP, Rabin-Karp","Bit Manipulation Techniques","Computational Geometry Basics","NP-Completeness & Approximation Algorithms","Competitive Programming Problem Practice"],
        duration: "14-20 Weeks",
        prereqs: "Data Structures"
    },
    "OOP": {
        topics: ["Procedural vs Object-Oriented Paradigm","Classes & Objects — Real World Modeling","Attributes & Methods","Constructors & Destructors","this/self Keyword","Encapsulation & Data Hiding","Access Modifiers — public, private, protected","Getters & Setters (Properties)","Single Inheritance","Multilevel & Hierarchical Inheritance","Multiple Inheritance & Diamond Problem","Method Overriding & super keyword","Polymorphism — Compile-time (Overloading)","Polymorphism — Runtime (Virtual Functions)","Abstract Classes & Abstract Methods","Interfaces & Multiple Interface Implementation","Composition vs Inheritance (Has-A vs Is-A)","Aggregation & Association","SOLID — Single Responsibility Principle","SOLID — Open/Closed, Liskov, Interface Segregation, Dependency Inversion","Design Pattern — Singleton","Design Pattern — Factory & Abstract Factory","Design Pattern — Observer & Strategy","Design Pattern — Decorator & Adapter","Design Pattern — MVC Architecture","UML Class Diagrams","Object Relationships Mapping","Build a Library Management System"],
        duration: "6-8 Weeks",
        prereqs: "Any OOP language (Java/Python/C++)"
    },
    "Operating Systems": {
        topics: ["OS Definition, Types & Architecture","System Calls & OS Services","Process — States, PCB, Context Switching","Process Scheduling — FCFS, SJF, Round Robin, Priority","Preemptive vs Non-Preemptive Scheduling","Inter-Process Communication — Pipes, Message Queues, Shared Memory","Threads — User vs Kernel Threads","Multithreading Models","Process Synchronization — Race Condition, Critical Section","Mutex, Semaphores & Monitors","Classical Problems — Producer-Consumer, Dining Philosophers, Readers-Writers","Deadlock — Conditions, Prevention, Avoidance (Banker's Algorithm)","Deadlock Detection & Recovery","Memory Management — Contiguous Allocation","Paging — Page Table, TLB, Multi-level Paging","Segmentation & Segmentation with Paging","Virtual Memory — Demand Paging","Page Replacement — FIFO, LRU, Optimal, Clock","Thrashing & Working Set Model","File Systems — FAT, NTFS, ext4, Inodes","Directory Structure & File Allocation Methods","Disk Scheduling — FCFS, SSTF, SCAN, C-SCAN","RAID Levels — 0, 1, 5, 10","I/O Management & Device Drivers","OS Security — Access Control, Authentication","Linux Commands Mastery","Shell Scripting — Bash Basics","Build Scripts for Process Automation"],
        duration: "12-14 Weeks",
        prereqs: "C language, Basic computer architecture"
    },
    "Computer Networks": {
        topics: ["Network Types — LAN, WAN, MAN, PAN","Network Topologies — Star, Bus, Ring, Mesh","OSI Model — All 7 Layers Detailed","TCP/IP Model — 4 Layers Comparison","Physical Layer — Cables, Hubs, Signals, Encoding","Data Link Layer — Framing, MAC, Error Detection (CRC)","Ethernet & IEEE 802.3","Switches & VLANs","Network Layer — IP Addressing (IPv4 & IPv6)","Subnetting & CIDR Notation","Routing — Static & Dynamic","Routing Protocols — RIP, OSPF, BGP","Transport Layer — TCP — 3-Way Handshake, Flow Control","Transport Layer — UDP & Comparison with TCP","Congestion Control — Slow Start, AIMD","Application Layer — HTTP/HTTPS, Methods, Status Codes","DNS — Resolution Process, Records (A, CNAME, MX)","DHCP — How It Works","NAT & PAT","Email Protocols — SMTP, POP3, IMAP","FTP & SSH","TLS/SSL — Certificates, Handshake","Network Security — Firewalls, IDS/IPS","Wireless Networks — Wi-Fi, Bluetooth","Socket Programming Basics","Wireshark Packet Analysis Lab","Network Troubleshooting Tools — ping, tracert, netstat, nslookup"],
        duration: "8-12 Weeks",
        prereqs: "Basic OS knowledge"
    },
    "AI Basics": {
        topics: ["What is AI — History, Turing Test, Timeline","Types of AI — Narrow, General, Super","Intelligent Agents — Types & Environments","Problem Solving — State Space Search","Uninformed Search — BFS, DFS, UCS","Informed Search — A*, Greedy Best-First","Heuristic Functions Design","Adversarial Search — Minimax, Alpha-Beta Pruning","Constraint Satisfaction Problems","Knowledge Representation — Frames, Semantic Nets","Propositional Logic & Inference","First-Order Predicate Logic","Rule-Based Expert Systems","Uncertainty — Probability & Bayes Theorem","Bayesian Networks","Fuzzy Logic Basics","Introduction to Machine Learning","Supervised vs Unsupervised Overview","Natural Language Processing — Tokenization, NER","Computer Vision Introduction — Edge Detection","Robotics & AI Ethics Overview","AI in Real World — Healthcare, Finance, Autonomous Vehicles","Build a Rule-Based AI Chatbot"],
        duration: "6-8 Weeks",
        prereqs: "Python, Basic Math"
    },
    "Machine Learning": {
        topics: ["What is ML — Types & Applications","Mathematics — Linear Algebra Refresher","Mathematics — Probability & Statistics for ML","Data Preprocessing — Cleaning, Encoding, Scaling","Train/Test Split & Cross-Validation","Linear Regression — Simple & Multiple","Gradient Descent — Batch, Stochastic, Mini-batch","Polynomial Regression & Regularization (L1/L2)","Logistic Regression — Binary & Multiclass","Decision Trees — Gini, Entropy, Pruning","Random Forests & Bagging","Gradient Boosting — XGBoost, LightGBM","Support Vector Machines — Kernels","K-Nearest Neighbors","Naive Bayes Classifier","K-Means Clustering","Hierarchical Clustering & DBSCAN","Dimensionality Reduction — PCA, t-SNE, UMAP","Association Rule Mining — Apriori","Model Evaluation — Accuracy, Precision, Recall, F1","ROC Curve & AUC","Confusion Matrix Analysis","Hyperparameter Tuning — Grid Search, Random Search","Feature Engineering & Selection","Bias-Variance Tradeoff","Ensemble Methods Deep Dive","Pipeline — sklearn Pipeline & ColumnTransformer","Model Serialization with Pickle/Joblib","MLflow for Experiment Tracking","Build a Complete Spam/Fraud Classifier"],
        duration: "14-18 Weeks",
        prereqs: "Python, Linear Algebra, Statistics"
    },
    "Deep Learning": {
        topics: ["Biological Neuron vs Artificial Neuron","Perceptron & Single Layer Network","Multi-Layer Perceptron (MLP)","Activation Functions — Sigmoid, ReLU, Tanh, Softmax, Leaky ReLU","Loss Functions — MSE, Cross-Entropy, Hinge","Forward Propagation Step-by-Step","Backpropagation & Chain Rule","Gradient Descent Optimizers — SGD, Adam, RMSProp, AdaGrad","Learning Rate Scheduling","Weight Initialization — Xavier, He","Regularization — Dropout, Batch Normalization, L2","TensorFlow & Keras Installation & Setup","Building Sequential & Functional Models","Convolutional Neural Networks — Filters, Stride, Padding","CNN Architectures — LeNet, AlexNet, VGG, ResNet, Inception","Pooling Layers — Max Pool, Average Pool","Image Classification Project","Object Detection — YOLO, SSD Overview","Recurrent Neural Networks — Vanishing Gradient Problem","LSTM & GRU — Architecture & Gates","Sequence-to-Sequence Models","Attention Mechanism & Transformers","BERT, GPT — Overview & Fine-Tuning","Transfer Learning — Pretrained Models","Generative Adversarial Networks (GANs)","Autoencoders — Vanilla, Variational","Model Deployment — TF Serving, ONNX, Flask API","Hyperparameter Tuning with Keras Tuner","GPU Training & Google Colab","Build an Image Classifier + Text Generator"],
        duration: "16-20 Weeks",
        prereqs: "Machine Learning, Calculus"
    },
    "Data Science": {
        topics: ["Data Science Lifecycle & Roles","Python for Data Science Setup (Anaconda, Jupyter)","NumPy — Arrays, Broadcasting, Vectorization","NumPy — Linear Algebra Operations","Pandas — Series & DataFrames","Pandas — Indexing, Filtering, Sorting","Pandas — GroupBy, Merge, Join, Concat","Pandas — Handling Missing Data & Duplicates","Pandas — DateTime Operations & Resampling","Data Visualization — Matplotlib Basics","Matplotlib — Subplots, Customization","Seaborn — Statistical Visualization","Seaborn — Heatmaps, Pair Plots, Violin Plots","Plotly — Interactive Charts & Dashboards","Exploratory Data Analysis (EDA) Framework","Statistical Measures — Mean, Median, Mode, Std Dev","Probability Distributions — Normal, Binomial, Poisson","Hypothesis Testing — t-test, chi-squared, ANOVA","Correlation vs Causation","Feature Engineering Techniques","Web Scraping — BeautifulSoup & Selenium","Working with APIs for Data Collection","SQL for Data Scientists","Big Data Concepts — Hadoop, Spark Overview","Storytelling with Data & Presentations","Build an End-to-End EDA + Prediction Dashboard"],
        duration: "10-14 Weeks",
        prereqs: "Python, Basic Statistics"
    },
    "UI/UX Design": {
        topics: ["What is UI vs UX — Differences & Overlap","Design Thinking — 5-Stage Process","User Research Methods — Interviews, Surveys, Observation","Empathy Mapping","User Personas & User Stories","Customer Journey Mapping","Information Architecture & Sitemap","Card Sorting Technique","Wireframing — Low-fidelity Sketches","Wireframing Tools — Balsamiq, Whimsical","Prototyping — High-fidelity Interactive","Figma — Interface, Components, Auto Layout","Figma — Prototyping, Interactions, Animations","Color Theory & Color Palettes","Typography — Hierarchy, Pairing, Readability","Iconography & Illustration Guidelines","Gestalt Principles of Visual Perception","Visual Hierarchy & Layout Grids","Responsive Design — Mobile, Tablet, Desktop","Interaction Design — Micro-interactions","Usability Testing & Think-Aloud Protocol","Heuristic Evaluation (Nielsen's 10 Heuristics)","Accessibility — WCAG Standards, Screen Readers","Design Systems & Component Libraries","Portfolio Building & Case Study Writing","Design a Complete Mobile App UI End-to-End"],
        duration: "8-10 Weeks",
        prereqs: "None — Creative mindset"
    },
    "Git & GitHub": {
        topics: ["Version Control — Why & Types","Git Installation & Configuration","git init, git status, git add, git commit","Commit Messages — Best Practices","git log — Viewing History, --oneline, --graph","git diff — Viewing Changes","Branching — git branch, git checkout, git switch","Merging Branches — Fast-Forward & 3-Way","Resolving Merge Conflicts","git stash — Saving Work Temporarily","Remote Repositories — git remote, origin","git push, git pull, git fetch","git clone & Forking Workflow","GitHub — Creating Repos, README, Licenses","GitHub — Issues, Labels, Milestones","Pull Requests — Creating, Reviewing, Merging","Code Reviews — Best Practices","git rebase vs git merge","Interactive Rebase — Squashing Commits","git cherry-pick","git reset — soft, mixed, hard","git revert — Undoing Commits Safely",".gitignore — Patterns & Templates","Git Tags — Annotated vs Lightweight","Git Hooks — pre-commit, post-merge","GitHub Actions — CI/CD Workflows","GitHub Pages — Deploying Static Sites","Collaborate on an Open Source Project"],
        duration: "3-4 Weeks",
        prereqs: "Any programming language"
    },
    "Cloud Computing": {
        topics: ["Cloud Computing — Definition & Characteristics","Cloud Models — IaaS, PaaS, SaaS, FaaS","Deployment Models — Public, Private, Hybrid","AWS Overview — Console, Regions, AZs","AWS EC2 — Instance Types, AMIs, Key Pairs","AWS S3 — Buckets, Objects, Permissions, Versioning","AWS Lambda — Serverless Functions","AWS RDS — Managed Databases","AWS DynamoDB — NoSQL in Cloud","AWS IAM — Users, Roles, Policies","AWS VPC — Subnets, Security Groups, NACLs","AWS CloudFront — CDN","AWS Elastic Beanstalk — Easy Deployment","Azure Virtual Machines & App Service","Azure Blob Storage & Azure Functions","Google Cloud Platform — Compute Engine, Cloud Storage","Docker on Cloud — ECS, EKS, AKS","Kubernetes Basics on Cloud","Serverless Architecture Patterns","Cloud Monitoring — CloudWatch, Azure Monitor","Cloud Security Best Practices","Auto Scaling & Load Balancing","Cost Management & Billing Alerts","CI/CD on Cloud — CodePipeline, Cloud Build","Infrastructure as Code — Terraform, CloudFormation","Deploy a Full-Stack Application to AWS"],
        duration: "10-14 Weeks",
        prereqs: "Networking basics, Linux"
    },
    "Cyber Security": {
        topics: ["CIA Triad — Confidentiality, Integrity, Availability","Types of Cyber Threats — Malware, Phishing, Ransomware","Security Policies & Frameworks (NIST, ISO 27001)","Cryptography — Symmetric (AES, DES)","Cryptography — Asymmetric (RSA, ECC)","Hashing — MD5, SHA-256, bcrypt","Digital Signatures & Certificates","PKI — Public Key Infrastructure","Network Security — Firewalls, IDS/IPS","VPN & Tunneling Protocols","Wireless Security — WPA2, WPA3","Web Security — OWASP Top 10","SQL Injection — Detection & Prevention","Cross-Site Scripting (XSS) — Types & Mitigation","Cross-Site Request Forgery (CSRF)","Authentication & Authorization Security","Session Management Vulnerabilities","Penetration Testing Methodology (PTES)","Kali Linux — Tools Overview","Nmap — Network Scanning","Burp Suite — Web Application Testing","Metasploit Framework Basics","Social Engineering Attacks & Defense","Vulnerability Assessment & Reporting","Incident Response — Detection, Containment, Recovery","Digital Forensics — Evidence Collection","Log Analysis & SIEM Tools","Security Compliance — GDPR, HIPAA, PCI-DSS","Bug Bounty Programs & Responsible Disclosure","Perform a Full CTF (Capture The Flag) Challenge"],
        duration: "14-18 Weeks",
        prereqs: "Networking, Linux, Web basics"
    },
    "DevOps": {
        topics: ["DevOps Culture, Principles & Benefits","Software Development Lifecycle (SDLC)","Agile & Scrum Methodology","Linux Administration — Users, Permissions, Services","Shell Scripting — Bash Automation","Networking Essentials for DevOps","Git Branching Strategies — GitFlow, Trunk-Based","Docker — Images, Containers, Volumes","Dockerfile — Multi-stage Builds","Docker Compose — Multi-container Apps","Container Registry — Docker Hub, ECR","Kubernetes — Architecture, Pods, Services","Kubernetes — Deployments, ReplicaSets, ConfigMaps","Kubernetes — Ingress, Namespaces, Resource Limits","Helm Charts for Package Management","CI/CD — Concepts, Stages, Best Practices","Jenkins — Pipelines, Jenkinsfile","GitHub Actions — Workflows, Jobs, Secrets","GitLab CI/CD","Infrastructure as Code — Terraform","Terraform — Providers, Resources, State","Configuration Management — Ansible Playbooks","Monitoring — Prometheus & Grafana Dashboards","Logging — ELK Stack (Elasticsearch, Logstash, Kibana)","Application Performance Monitoring (APM)","Service Mesh — Istio Basics","Secrets Management — Vault","Site Reliability Engineering (SRE) Concepts","Build a Full End-to-End CI/CD Pipeline"],
        duration: "14-20 Weeks",
        prereqs: "Linux, Git, Cloud basics"
    },
    "Mobile App Development": {
        topics: ["Native vs Hybrid vs Cross-Platform","React Native Setup & Project Structure","Flutter Setup & Dart Language Basics","Component Architecture — Views, Widgets","Styling — StyleSheet (RN), ThemeData (Flutter)","Navigation — Stack, Tab, Drawer","State Management — useState, setState","Advanced State — Redux (RN), Provider/Riverpod (Flutter)","Lists & ScrollView — FlatList, ListView","Forms & Input Handling","Platform APIs — Camera, Image Picker","Geolocation & Maps Integration","Local Storage — AsyncStorage, SharedPreferences","SQLite Database for Offline Data","REST API Integration — fetch, http/dio","Authentication — Firebase Auth, JWT","Push Notifications — FCM Setup","Animations — Animated API, AnimationController","Gestures — Swipe, Pan, Pinch","File System Access & Downloads","Deep Linking & URL Handling","App Permissions Handling","Testing — Unit, Widget, Integration","Performance Optimization","Building APK/IPA for Release","App Store & Play Store Submission","Build a Complete Weather + Notes App"],
        duration: "10-14 Weeks",
        prereqs: "JavaScript or Dart basics"
    },
    "Flask": {
        topics: ["Flask Installation & Virtual Environment","App Factory Pattern & Configuration","Routing — URL Rules, Variable Rules, Methods","Request Object — args, form, files, json","Response Object — make_response, redirect, abort","Jinja2 Templates — Variables, Loops, Conditionals","Template Inheritance & Macros","Static Files — CSS, JS, Images","Flask Blueprints — Modular Application","Flask Forms with WTForms & Validation","Flash Messages & Session Management","Database — Flask-SQLAlchemy Setup","Models, Relationships & Migrations (Flask-Migrate)","CRUD Operations with SQLAlchemy","User Authentication — Flask-Login","Password Hashing with Werkzeug","RESTful API Design with Flask","Flask-RESTful Extension","JWT Authentication — Flask-JWT-Extended","File Upload Handling","Error Handling — Custom Error Pages","Logging & Configuration Management","Flask-Mail for Email Sending","Unit Testing Flask Applications","Deployment — Gunicorn, Nginx, Docker","Build a Complete Blog Platform with Auth & API"],
        duration: "6-8 Weeks",
        prereqs: "Python basics"
    },
    "Django": {
        topics: ["Django Philosophy & Architecture (MVT)","Project Setup — django-admin startproject","App Creation — startapp & App Registration","URL Routing — urls.py, path(), include()","Views — Function-Based Views (FBV)","Templates — DTL Tags, Filters, Inheritance","Static Files & Media Files Configuration","Models — Fields, Relationships (ForeignKey, ManyToMany)","Django ORM — QuerySets, Filters, Annotations","Migrations — makemigrations, migrate","Django Admin — Customization, ModelAdmin","Forms — Django Forms, ModelForms, Validation","Class-Based Views — ListView, DetailView, CreateView","Mixins & Generic Views","User Authentication — Login, Logout, Register","Permissions & Groups","Django REST Framework — Serializers","DRF — ViewSets, Routers, Pagination","DRF — Authentication (Token, JWT, Session)","DRF — Permissions & Throttling","Signals — pre_save, post_save, post_delete","Middleware — Custom Middleware Creation","Caching — Database, File, Redis","Celery — Async Tasks & Background Jobs","Testing — pytest-django, Factory Boy","Django Channels — WebSockets","Deployment — Docker, Gunicorn, Nginx, Heroku","Build a Social Media Platform with API"],
        duration: "12-16 Weeks",
        prereqs: "Python, Basic SQL"
    },
    "API Development": {
        topics: ["What is an API — Types (REST, SOAP, GraphQL)","REST Architecture — Constraints & Principles","HTTP Methods — GET, POST, PUT, PATCH, DELETE","Status Codes — 2xx, 3xx, 4xx, 5xx Deep Dive","Request/Response Headers & Content Types","URL Design & Resource Naming Conventions","Query Parameters vs Path Parameters","Request Body — JSON, Form Data, Multipart","Response Design — Enveloping, Pagination","Authentication — API Keys","Authentication — OAuth 2.0 Flow","Authentication — JWT (Access & Refresh Tokens)","Authorization — Role-Based Access Control (RBAC)","Rate Limiting & Throttling Implementation","API Versioning — URL, Header, Query","Input Validation & Sanitization","Error Handling — Consistent Error Responses","CORS — Cross-Origin Configuration","API Documentation — Swagger/OpenAPI Spec","Postman — Collections, Environments, Testing","API Testing — Unit Tests, Integration Tests","API Mocking & Contract Testing","Webhooks — Design & Implementation","GraphQL — Schema, Queries, Mutations, Subscriptions","gRPC — Protocol Buffers Introduction","API Gateway Patterns","API Security Best Practices","API Monitoring & Analytics","Build & Publish a Documented Public REST API"],
        duration: "6-8 Weeks",
        prereqs: "Any backend framework"
    },
    "System Design": {
        topics: ["System Design Interview Framework","Requirements Gathering — Functional & Non-Functional","Back-of-Envelope Estimation & Capacity Planning","Scalability — Vertical vs Horizontal Scaling","Load Balancers — L4 vs L7, Algorithms (Round Robin, Least Connections)","Reverse Proxy — Nginx, HAProxy","Caching — Client, CDN, Server, Database Level","Cache Strategies — Write-Through, Write-Behind, Cache-Aside","Redis & Memcached — When to Use","Content Delivery Networks (CDN)","Database Selection — SQL vs NoSQL","Database Indexing & Query Optimization","Database Replication — Master-Slave, Master-Master","Database Sharding — Horizontal Partitioning","Consistent Hashing","CAP Theorem & PACELC","Message Queues — Kafka, RabbitMQ, SQS","Event-Driven Architecture","Microservices vs Monolith","Service Discovery & API Gateway","Rate Limiter Design","URL Shortener Design (like bit.ly)","Design Twitter / News Feed System","Design Instagram / Photo Sharing","Design WhatsApp / Chat System","Design YouTube / Video Streaming","Design Uber / Ride Sharing","Design Notification System","Distributed Systems — Consensus (Raft, Paxos)","Mock System Design Interview Practice"],
        duration: "12-16 Weeks",
        prereqs: "DSA, Databases, Networking, Cloud"
    }
};

// ═══════════════════════════════════════════════════════
//  RENDER TIMELINE
// ═══════════════════════════════════════════════════════

const COURSE_ORDER = [
    "Python","Java","C","C++","HTML","CSS","JavaScript","React JS",
    "Node JS","Express JS","MongoDB","SQL","Data Structures","Algorithms",
    "OOP","Operating Systems","Computer Networks","AI Basics",
    "Machine Learning","Deep Learning","Data Science","UI/UX Design",
    "Git & GitHub","Cloud Computing","Cyber Security","DevOps",
    "Mobile App Development","Flask","Django","API Development","System Design"
];

let activeFilter = 'All';

function renderTimeline(filter) {
    activeFilter = filter;
    const wrapper = document.getElementById('timeline-nodes');
    wrapper.innerHTML = '';

    // Update filter button states
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.filter === filter);
    });

    let count = 0;
    COURSE_ORDER.forEach((title, index) => {
        const data = ROADMAP_DATA[title];
        if (!data) return;

        // Determine difficulty from seed data mapping
        const difficultyMap = {
            "Python":"Beginner","Java":"Intermediate","C":"Intermediate","C++":"Advanced",
            "HTML":"Beginner","CSS":"Beginner","JavaScript":"Intermediate","React JS":"Intermediate",
            "Node JS":"Intermediate","Express JS":"Intermediate","MongoDB":"Intermediate","SQL":"Beginner",
            "Data Structures":"Intermediate","Algorithms":"Advanced","OOP":"Intermediate",
            "Operating Systems":"Advanced","Computer Networks":"Intermediate","AI Basics":"Beginner",
            "Machine Learning":"Intermediate","Deep Learning":"Advanced","Data Science":"Intermediate",
            "UI/UX Design":"Beginner","Git & GitHub":"Beginner","Cloud Computing":"Intermediate",
            "Cyber Security":"Advanced","DevOps":"Advanced","Mobile App Development":"Intermediate",
            "Flask":"Intermediate","Django":"Advanced","API Development":"Intermediate","System Design":"Advanced"
        };

        const difficulty = difficultyMap[title] || 'Intermediate';
        if (filter !== 'All' && difficulty !== filter) return;

        count++;

        const node = document.createElement('div');
        node.className = 'course-node';
        node.innerHTML = `
            <div class="node-dot" data-difficulty="${difficulty}"></div>
            <div class="node-card" onclick="toggleTopics(this)">
                <div class="step-num">Step ${index + 1} of 31</div>
                <h3>${title}</h3>
                <span class="diff-badge ${difficulty}">${difficulty}</span>
                <p class="desc">${data.prereqs}</p>
                <div class="topics-toggle" onclick="event.stopPropagation(); toggleTopics(this.closest('.node-card'))">▼ View Learning Path (${data.topics.length} topics)</div>
                <div class="topics-list">
                    <ul>
                        ${data.topics.map((t, i) => `<li><span style="color:var(--accent-glow);font-weight:700;min-width:20px;">${i+1}.</span> ${t}</li>`).join('')}
                    </ul>
                </div>
                <div class="meta-row">
                    <span class="duration-tag">⏱ ${data.duration}</span>
                    <button class="start-btn" style="background: linear-gradient(135deg, #6366f1, #4f46e5); color: white;" onclick="event.stopPropagation(); window.open(TAMIL_COURSE_VIDEOS['${title}'], '_blank')">
                        ▶ Watch Full Course (Tamil)
                    </button>
                </div>
            </div>
        `;
        wrapper.appendChild(node);
    });

    // Update stats
    const beginnerCount = COURSE_ORDER.filter(t => (difficultyMapGlobal[t]||'') === 'Beginner').length;
    const intermediateCount = COURSE_ORDER.filter(t => (difficultyMapGlobal[t]||'') === 'Intermediate').length;
    const advancedCount = COURSE_ORDER.filter(t => (difficultyMapGlobal[t]||'') === 'Advanced').length;

    document.getElementById('stat-beginner').textContent = beginnerCount;
    document.getElementById('stat-intermediate').textContent = intermediateCount;
    document.getElementById('stat-advanced').textContent = advancedCount;

    // Re-attach scroll observer
    observeNodes();
}

// Global difficulty map for stats
const difficultyMapGlobal = {
    "Python":"Beginner","Java":"Intermediate","C":"Intermediate","C++":"Advanced",
    "HTML":"Beginner","CSS":"Beginner","JavaScript":"Intermediate","React JS":"Intermediate",
    "Node JS":"Intermediate","Express JS":"Intermediate","MongoDB":"Intermediate","SQL":"Beginner",
    "Data Structures":"Intermediate","Algorithms":"Advanced","OOP":"Intermediate",
    "Operating Systems":"Advanced","Computer Networks":"Intermediate","AI Basics":"Beginner",
    "Machine Learning":"Intermediate","Deep Learning":"Advanced","Data Science":"Intermediate",
    "UI/UX Design":"Beginner","Git & GitHub":"Beginner","Cloud Computing":"Intermediate",
    "Cyber Security":"Advanced","DevOps":"Advanced","Mobile App Development":"Intermediate",
    "Flask":"Intermediate","Django":"Advanced","API Development":"Intermediate","System Design":"Advanced"
};

// ═══════════════════════════════════════════════════════
//  SCROLL-TRIGGERED REVEAL ANIMATION
// ═══════════════════════════════════════════════════════

function observeNodes() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    document.querySelectorAll('.course-node').forEach(node => {
        observer.observe(node);
    });
}

// ═══════════════════════════════════════════════════════
//  EXPAND / COLLAPSE TOPICS
// ═══════════════════════════════════════════════════════

function toggleTopics(card) {
    const list = card.querySelector('.topics-list');
    const toggle = card.querySelector('.topics-toggle');
    if (!list) return;

    list.classList.toggle('open');
    if (list.classList.contains('open')) {
        toggle.textContent = toggle.textContent.replace('▼', '▲').replace('View', 'Hide');
    } else {
        toggle.textContent = toggle.textContent.replace('▲', '▼').replace('Hide', 'View');
    }
}

// ═══════════════════════════════════════════════════════
//  INIT
// ═══════════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {
    renderTimeline('All');
});
