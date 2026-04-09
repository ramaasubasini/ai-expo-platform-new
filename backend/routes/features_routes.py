import os
import sys
import random
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from flask import Blueprint, request, jsonify  # type: ignore
from flask_jwt_extended import jwt_required, get_jwt_identity, verify_jwt_in_request  # type: ignore
from datetime import datetime

from database import (  # type: ignore
    users_collection, profiles_collection, notes_collection,
    study_rooms_collection, interview_collection, leaderboard_collection,
    courses_collection, moods_collection
)

features_bp = Blueprint('features', __name__)

# ═══════════════════════════════════════════════════════
#  1. LEADERBOARD SYSTEM
# ═══════════════════════════════════════════════════════

@features_bp.route('/leaderboard', methods=['GET'])
def get_leaderboard():
    """Get global leaderboard ranking all students by XP"""
    all_users = users_collection.find({})
    leaderboard = []
    for u in all_users:
        if isinstance(u, dict):
            leaderboard.append({
                "name": u.get("name", "Anonymous"),
                "email": u.get("email", ""),
                "xp": int(u.get("xp", 0)),
                "completed": int(u.get("completed_courses", 0)),
                "streak": int(u.get("streak", 0)),
                "level": get_level(int(u.get("xp", 0)))
            })
    
    leaderboard.sort(key=lambda x: x["xp"], reverse=True)
    
    current_email = None
    try:
        verify_jwt_in_request(optional=True)
        current_email = get_jwt_identity()
    except Exception:
        pass
    
    my_rank = 0
    if current_email:
        for i, entry in enumerate(leaderboard):
            if entry["email"] == current_email:
                my_rank = i + 1
                break
    
    return jsonify({
        "leaderboard": leaderboard,
        "my_rank": my_rank,
        "total_students": len(leaderboard)
    }), 200


def get_level(xp):
    if xp >= 5000: return "🏆 Grandmaster"
    if xp >= 3000: return "💎 Diamond"
    if xp >= 2000: return "🥇 Gold"
    if xp >= 1000: return "🥈 Silver"
    if xp >= 500: return "🥉 Bronze"
    if xp >= 100: return "⭐ Rookie"
    return "🌱 Beginner"


# ═══════════════════════════════════════════════════════
#  2. AUTO NOTES GENERATOR — ALL 31 COURSES
# ═══════════════════════════════════════════════════════

COURSE_NOTES = {
    "Python": [
        "## Variables & Data Types\n- Python uses dynamic typing — no need to declare types\n- Basic types: int, float, str, bool, complex\n- Collections: list (mutable), tuple (immutable), dict (key-value), set (unique)\n- Type conversion: int(), str(), float(), list()\n- Use type() and isinstance() to check types",
        "## Control Flow & Loops\n- if/elif/else for conditional branching\n- for loops: iterate over range(), lists, dicts, strings\n- while loops with break, continue, pass\n- List comprehensions: [x**2 for x in range(10)]\n- Ternary: value = a if condition else b",
        "## Functions & Decorators\n- def keyword; return values with return\n- Default args, *args, **kwargs for flexibility\n- Lambda: square = lambda x: x**2\n- Decorators: @decorator_name wraps functions\n- Closures: inner functions accessing outer scope",
        "## OOP — Classes & Objects\n- class ClassName: with __init__ constructor\n- self refers to current instance\n- Inheritance: class Child(Parent)\n- Encapsulation: _private, __name_mangling\n- Polymorphism, @staticmethod, @classmethod\n- Magic methods: __str__, __repr__, __len__",
        "## File Handling & Exception Management\n- open('file.txt', 'r/w/a') with context managers\n- with open() as f: — auto-closes file\n- try/except/else/finally for error handling\n- Custom exceptions: class MyError(Exception)\n- Reading: read(), readline(), readlines()",
        "## Modules & Packages\n- import module, from module import func\n- pip install package_name\n- __init__.py makes directories packages\n- Popular: os, sys, json, datetime, re, math\n- Virtual environments: venv, pipenv"
    ],
    "JavaScript": [
        "## Variables & Data Types\n- let (block scope), const (constant), var (function scope — avoid)\n- Types: string, number, boolean, null, undefined, symbol, bigint\n- Objects: {} key-value pairs, arrays: []\n- typeof operator checks type\n- Template literals: `Hello ${name}`",
        "## DOM Manipulation\n- document.getElementById(), querySelector(), querySelectorAll()\n- addEventListener('click', handler)\n- createElement(), appendChild(), removeChild()\n- innerHTML, textContent, style, classList\n- Event delegation & bubbling/capturing",
        "## Async Programming\n- Callbacks → callback hell problem\n- Promises: new Promise((resolve, reject) => {})\n- .then().catch().finally() chaining\n- async/await: cleaner syntax for Promises\n- fetch() API for HTTP requests",
        "## ES6+ Modern Features\n- Arrow functions: (a, b) => a + b\n- Destructuring: const {x, y} = obj; const [a, b] = arr\n- Spread/rest: ...array, ...params\n- Optional chaining: obj?.prop?.nested\n- Nullish coalescing: value ?? default\n- Modules: import/export",
        "## Error Handling & Debugging\n- try/catch/finally blocks\n- throw new Error('message')\n- console.log(), console.error(), console.table()\n- Browser DevTools: breakpoints, network tab\n- Common errors: TypeError, ReferenceError, SyntaxError"
    ],
    "Java": [
        "## Java Basics\n- Strongly typed, compiled language (JDK/JRE/JVM)\n- public static void main(String[] args)\n- Primitive types: byte, short, int, long, float, double, char, boolean\n- Wrapper classes: Integer, Double, Character\n- Scanner for input, System.out.println for output",
        "## OOP in Java\n- Class, Object, Constructor, this keyword\n- Encapsulation: private fields + getters/setters\n- Inheritance: extends keyword, super()\n- Polymorphism: method overloading & overriding\n- Abstraction: abstract class, interface\n- final, static modifiers",
        "## Collections Framework\n- List: ArrayList, LinkedList\n- Set: HashSet, TreeSet, LinkedHashSet\n- Map: HashMap, TreeMap, LinkedHashMap\n- Queue: PriorityQueue, Deque\n- Iterator, for-each loop, Collections utility class",
        "## Exception Handling & File I/O\n- try/catch/finally, throws, throw\n- Checked vs Unchecked exceptions\n- Custom exceptions extend Exception\n- FileReader, BufferedReader, FileWriter\n- Serialization: Serializable interface"
    ],
    "C": [
        "## C Fundamentals\n- #include <stdio.h>, main() function\n- Data types: int, float, double, char\n- printf() and scanf() for I/O\n- Operators: arithmetic, relational, logical, bitwise\n- Preprocessor directives: #define, #include, #ifdef",
        "## Pointers & Memory\n- Pointer declaration: int *p = &var\n- Pointer arithmetic, NULL pointer\n- Dynamic memory: malloc(), calloc(), realloc(), free()\n- Pass by value vs pass by reference\n- Function pointers",
        "## Arrays, Strings & Structures\n- Arrays: int arr[10], 2D arrays\n- Strings: char arrays, string.h functions (strlen, strcpy, strcmp)\n- Structures: struct, typedef\n- Unions: shared memory for members\n- Enumerations: enum",
        "## File Handling\n- fopen(), fclose(), fread(), fwrite()\n- fprintf(), fscanf()\n- File modes: r, w, a, rb, wb\n- fseek(), ftell(), rewind()\n- Error handling with errno"
    ],
    "C++": [
        "## C++ Basics & OOP\n- Extension of C with classes and objects\n- cin/cout for I/O, namespaces (std)\n- Classes: access specifiers (public, private, protected)\n- Constructor, destructor, copy constructor\n- Operator overloading",
        "## STL — Standard Template Library\n- Containers: vector, list, deque, stack, queue, map, set\n- Iterators: begin(), end(), auto keyword\n- Algorithms: sort(), find(), binary_search(), reverse()\n- Pairs, tuples\n- String class vs C-style strings",
        "## Advanced C++\n- Templates: function & class templates\n- Exception handling: try/catch/throw\n- Smart pointers: unique_ptr, shared_ptr, weak_ptr\n- Lambda expressions: [](int x) { return x*2; }\n- Move semantics & rvalue references",
        "## Memory Management\n- new/delete vs malloc/free\n- Stack vs heap memory\n- Memory leaks and dangling pointers\n- RAII (Resource Acquisition Is Initialization)\n- Virtual functions and vtable"
    ],
    "HTML": [
        "## HTML Structure\n- <!DOCTYPE html>, <html>, <head>, <body>\n- Semantic tags: header, nav, main, section, article, footer\n- Headings: h1-h6, paragraphs: p\n- div (block) vs span (inline)\n- Comments: <!-- comment -->",
        "## Forms & Input\n- <form> with action and method (GET/POST)\n- Input types: text, email, password, number, date, file, checkbox, radio\n- <select>, <textarea>, <button>\n- Required, placeholder, pattern attributes\n- Form validation (HTML5 built-in)",
        "## Media & Tables\n- Images: <img src='' alt=''>\n- Video: <video controls>, Audio: <audio>\n- Tables: <table>, <tr>, <th>, <td>, colspan, rowspan\n- Lists: <ul>, <ol>, <li>, <dl>\n- iframes for embedding content",
        "## HTML5 APIs & SEO\n- Local Storage & Session Storage\n- Geolocation API\n- Canvas and SVG for graphics\n- Meta tags for SEO: title, description, viewport\n- Open Graph tags for social sharing\n- Accessibility: aria attributes, alt text"
    ],
    "CSS": [
        "## CSS Selectors & Properties\n- Element, class (.), ID (#), attribute selectors\n- Pseudo-classes: :hover, :focus, :nth-child\n- Pseudo-elements: ::before, ::after\n- Specificity: inline > ID > class > element\n- !important (use sparingly)",
        "## Box Model & Layout\n- Content, padding, border, margin\n- box-sizing: border-box\n- Display: block, inline, inline-block, none, flex, grid\n- Position: static, relative, absolute, fixed, sticky\n- Float and clear (legacy)",
        "## Flexbox & Grid\n- Flexbox: display:flex, justify-content, align-items, flex-wrap\n- flex-direction: row/column\n- Grid: display:grid, grid-template-columns/rows\n- grid-gap, grid-area, fr units\n- Auto-fit, auto-fill, minmax()",
        "## Responsive Design & Animations\n- Media queries: @media (max-width: 768px)\n- Mobile-first approach\n- CSS Variables: --custom-property\n- Transitions: transition: all 0.3s ease\n- Keyframe animations: @keyframes name {}\n- Transform: translate, rotate, scale"
    ],
    "React JS": [
        "## React Fundamentals\n- Component-based architecture\n- JSX: HTML-like syntax in JavaScript\n- Functional vs Class components\n- Props: passing data to children\n- State: useState hook for reactive data",
        "## Hooks & Lifecycle\n- useState: state management\n- useEffect: side effects, lifecycle replacement\n- useContext: global state without prop drilling\n- useRef: DOM references\n- useMemo, useCallback: performance optimization\n- Custom hooks: reusable logic",
        "## Routing & State Management\n- React Router: BrowserRouter, Route, Link\n- Dynamic routes: /user/:id\n- Redux: store, actions, reducers\n- Context API: Provider/Consumer pattern\n- Zustand, Recoil (lightweight alternatives)",
        "## Advanced React\n- Server Side Rendering (SSR) with Next.js\n- Code splitting: React.lazy(), Suspense\n- Error boundaries\n- Higher Order Components (HOCs)\n- Render props pattern\n- Testing: Jest, React Testing Library"
    ],
    "Node JS": [
        "## Node.js Core\n- JavaScript runtime built on V8 engine\n- Non-blocking I/O, event-driven architecture\n- npm: package manager, package.json, node_modules\n- Modules: require() / import, module.exports\n- Built-in modules: fs, path, http, os, events",
        "## Express.js Framework\n- app.get(), app.post(), app.put(), app.delete()\n- Middleware: app.use(), next()\n- Router: express.Router()\n- Template engines: EJS, Pug\n- Static files: express.static()",
        "## REST API Development\n- RESTful principles: GET, POST, PUT, DELETE\n- Request: req.params, req.query, req.body\n- Response: res.json(), res.status()\n- Error handling middleware\n- CORS: cross-origin resource sharing",
        "## Authentication & Security\n- JWT: jsonwebtoken, token-based auth\n- bcrypt: password hashing\n- Session-based vs Token-based auth\n- Helmet.js: security headers\n- Rate limiting, input validation"
    ],
    "SQL": [
        "## SQL Basics\n- CREATE TABLE, DROP TABLE, ALTER TABLE\n- INSERT INTO, UPDATE, DELETE FROM\n- SELECT with WHERE, ORDER BY, LIMIT\n- Data types: INT, VARCHAR, TEXT, DATE, BOOLEAN\n- Primary key, AUTO_INCREMENT",
        "## Joins & Relationships\n- INNER JOIN, LEFT JOIN, RIGHT JOIN, FULL OUTER JOIN\n- ON clause for join conditions\n- One-to-one, one-to-many, many-to-many\n- Foreign keys and referential integrity\n- Self joins",
        "## Advanced Queries\n- GROUP BY with HAVING\n- Aggregate functions: COUNT, SUM, AVG, MIN, MAX\n- Subqueries: nested SELECT statements\n- UNION, INTERSECT, EXCEPT\n- CASE WHEN for conditional logic",
        "## Indexing & Optimization\n- CREATE INDEX for faster queries\n- Query execution plans (EXPLAIN)\n- Normalization: 1NF, 2NF, 3NF, BCNF\n- Transactions: BEGIN, COMMIT, ROLLBACK\n- ACID properties"
    ],
    "MongoDB": [
        "## MongoDB Basics\n- NoSQL document database (JSON/BSON)\n- Collections = tables, Documents = rows\n- db.collection.insertOne() / insertMany()\n- db.collection.find() with query filters\n- db.collection.updateOne() / deleteOne()",
        "## Query & Aggregation\n- Comparison: $eq, $gt, $lt, $in, $ne\n- Logical: $and, $or, $not\n- Aggregation pipeline: $match, $group, $sort, $project\n- $lookup for joins between collections\n- $unwind for array flattening",
        "## Schema Design\n- Embedding vs referencing documents\n- One-to-many relationships\n- Schema validation rules\n- Indexes: createIndex(), compound indexes\n- TTL indexes for auto-expiry",
        "## Mongoose ODM\n- Schema definition with types and validation\n- Model.find(), Model.create(), Model.findByIdAndUpdate()\n- Middleware: pre/post hooks\n- Population for referenced documents\n- Virtual fields"
    ],
    "Data Structures": [
        "## Arrays & Linked Lists\n- Arrays: contiguous memory, O(1) access, O(n) insert/delete\n- Static vs Dynamic arrays\n- Singly Linked List: node with data + next pointer\n- Doubly Linked List: prev + next pointers\n- Circular Linked List",
        "## Stacks & Queues\n- Stack: LIFO, push/pop/peek, O(1) operations\n- Applications: undo, expression evaluation, DFS\n- Queue: FIFO, enqueue/dequeue\n- Circular Queue, Priority Queue\n- Deque: double-ended queue",
        "## Trees\n- Binary Tree: max 2 children per node\n- BST: left < root < right, O(log n) search\n- AVL Tree: self-balancing BST\n- Heap: min-heap, max-heap for priority queues\n- Trie: prefix tree for string searches",
        "## Graphs & Hash Tables\n- Graph: vertices + edges, directed/undirected\n- Adjacency matrix vs adjacency list\n- BFS (queue) vs DFS (stack/recursion)\n- Hash Table: key → hash → bucket\n- Collision handling: chaining, open addressing"
    ],
    "Algorithms": [
        "## Sorting Algorithms\n- Bubble Sort: O(n²), compare adjacent\n- Selection Sort: O(n²), find minimum\n- Insertion Sort: O(n²), insert in sorted part\n- Merge Sort: O(n log n), divide and conquer\n- Quick Sort: O(n log n) avg, pivot partitioning",
        "## Searching & Graph Algorithms\n- Linear Search: O(n)\n- Binary Search: O(log n), sorted data required\n- BFS: shortest path in unweighted graph\n- DFS: topological sort, cycle detection\n- Dijkstra's: shortest path with weights",
        "## Dynamic Programming\n- Overlapping subproblems + optimal substructure\n- Top-down (memoization) vs Bottom-up (tabulation)\n- Classic problems: Fibonacci, knapsack, LCS, coin change\n- State transition equations\n- Time-space tradeoffs",
        "## Greedy & Backtracking\n- Greedy: locally optimal choices (activity selection, Huffman)\n- Backtracking: try all options, backtrack on failure\n- N-Queens problem, Sudoku solver\n- Divide and Conquer: merge sort, binary search\n- Two pointers, sliding window techniques"
    ],
    "Machine Learning": [
        "## Core Concepts\n- Supervised: labeled data (classification, regression)\n- Unsupervised: unlabeled (clustering, dimensionality reduction)\n- Semi-supervised & Reinforcement learning\n- Train/Test/Validation split\n- Cross-validation for robust evaluation",
        "## Key Algorithms\n- Linear Regression: y = mx + b, least squares\n- Logistic Regression: sigmoid for classification\n- Decision Trees: if-else branching, Gini/Entropy\n- Random Forest: ensemble of trees, bagging\n- SVM: hyperplane separator, kernel trick\n- k-NN: distance-based classification",
        "## Model Evaluation\n- Accuracy, Precision, Recall, F1-Score\n- Confusion Matrix: TP, FP, TN, FN\n- ROC Curve & AUC score\n- Bias-Variance tradeoff\n- Overfitting: regularization (L1, L2)",
        "## Feature Engineering\n- Normalization & Standardization (MinMax, Z-score)\n- One-hot encoding for categories\n- Feature selection: correlation, mutual information, PCA\n- Handling missing values: imputation\n- Feature scaling and transformation"
    ],
    "Deep Learning": [
        "## Neural Networks Basics\n- Perceptron: weighted sum + activation\n- Activation functions: ReLU, sigmoid, tanh, softmax\n- Forward propagation: input → hidden → output\n- Backpropagation: gradient descent to update weights\n- Loss functions: MSE, cross-entropy",
        "## CNN — Convolutional Neural Networks\n- Convolution layers: feature detection with filters\n- Pooling: max pooling, average pooling\n- Architecture: Conv → Pool → Flatten → Dense\n- Applications: image classification, object detection\n- Famous models: LeNet, AlexNet, VGG, ResNet",
        "## RNN & Transformers\n- RNN: sequential data, hidden state memory\n- LSTM: long short-term memory, forget gate\n- GRU: simplified LSTM\n- Transformers: self-attention mechanism\n- BERT, GPT architecture overview",
        "## Training & Optimization\n- Optimizers: SGD, Adam, RMSprop, Adagrad\n- Learning rate scheduling\n- Batch normalization, dropout for regularization\n- Data augmentation for small datasets\n- Transfer learning: fine-tuning pretrained models"
    ],
    "AI Basics": [
        "## What is AI?\n- Artificial Intelligence: machines simulating human intelligence\n- Narrow AI vs General AI vs Super AI\n- Machine Learning as subset of AI\n- Deep Learning as subset of ML\n- Applications: NLP, Computer Vision, Robotics",
        "## AI Techniques\n- Search algorithms: BFS, DFS, A*\n- Knowledge representation: ontologies, semantic nets\n- Natural Language Processing: tokenization, NER, sentiment\n- Computer Vision: image recognition, object detection\n- Expert systems: rule-based reasoning",
        "## Ethics & Future\n- Bias in AI models and datasets\n- Privacy concerns and data protection\n- Job displacement vs augmentation\n- Explainable AI (XAI)\n- Responsible AI development practices"
    ],
    "Data Science": [
        "## Data Analysis Pipeline\n- Data Collection → Cleaning → EDA → Modeling → Visualization\n- Pandas: DataFrame, Series, read_csv(), groupby()\n- NumPy: arrays, broadcasting, linear algebra\n- Data cleaning: handling nulls, duplicates, outliers\n- Exploratory Data Analysis (EDA)",
        "## Visualization\n- Matplotlib: plt.plot(), plt.bar(), plt.scatter()\n- Seaborn: heatmap, pairplot, boxplot\n- Plotly: interactive visualizations\n- Dashboard tools: Streamlit, Dash\n- Storytelling with data",
        "## Statistical Foundations\n- Descriptive stats: mean, median, mode, std dev\n- Probability: Bayes theorem, distributions\n- Hypothesis testing: p-value, t-test, chi-square\n- Correlation vs causation\n- A/B testing methodology"
    ],
    "OOP": [
        "## Core OOP Principles\n- Encapsulation: bundling data + methods, access control\n- Abstraction: hiding complexity, showing interface\n- Inheritance: code reuse, parent-child relationship\n- Polymorphism: same interface, different behavior\n- SOLID principles overview",
        "## Design Patterns\n- Creational: Singleton, Factory, Builder\n- Structural: Adapter, Decorator, Facade\n- Behavioral: Observer, Strategy, Command\n- MVC architecture pattern\n- When to use which pattern"
    ],
    "Git & GitHub": [
        "## Git Basics\n- git init, git clone, git status\n- git add, git commit -m 'message'\n- git push, git pull, git fetch\n- .gitignore file for excluding files\n- git log, git diff for history",
        "## Branching & Collaboration\n- git branch, git checkout, git merge\n- Feature branch workflow\n- Pull requests and code reviews\n- Merge conflicts: resolution strategies\n- git rebase vs git merge",
        "## Advanced Git\n- git stash: save work temporarily\n- git cherry-pick: apply specific commits\n- git reset vs git revert\n- Tags: git tag v1.0.0\n- GitHub Actions: CI/CD workflows"
    ],
    "Express JS": [
        "## Express Fundamentals\n- Minimal Node.js web framework\n- Routing: app.get/post/put/delete()\n- Middleware stack: app.use()\n- Request (req) and Response (res) objects\n- Template engines: EJS, Pug, Handlebars",
        "## API Development\n- RESTful API design principles\n- Body parsing: express.json(), express.urlencoded()\n- Route parameters and query strings\n- Error handling middleware\n- Response methods: res.json(), res.send(), res.status()"
    ],
    "Flask": [
        "## Flask Basics\n- Micro-framework for Python web apps\n- @app.route() decorator for routing\n- Templates with Jinja2\n- Request: request.form, request.json, request.args\n- Response: jsonify(), render_template()",
        "## Flask Architecture\n- Blueprints for modular apps\n- Flask extensions: Flask-SQLAlchemy, Flask-Login, Flask-JWT\n- Database integration with SQLAlchemy\n- RESTful APIs with Flask-RESTful\n- Configuration management"
    ],
    "Django": [
        "## Django Fundamentals\n- Full-featured web framework (batteries included)\n- MVT: Model-View-Template architecture\n- manage.py: startproject, startapp, runserver\n- URL routing: urls.py, path()\n- Views: function-based vs class-based",
        "## Django ORM & Admin\n- Models: define database schema in Python\n- Migrations: makemigrations, migrate\n- QuerySet API: filter(), exclude(), annotate()\n- Django Admin: auto-generated admin panel\n- Forms: ModelForm, validation, CSRF protection"
    ],
    "Cloud Computing": [
        "## Cloud Fundamentals\n- IaaS, PaaS, SaaS service models\n- Public, Private, Hybrid cloud types\n- AWS, Azure, GCP — major providers\n- Virtualization and containerization\n- Pay-as-you-go pricing model",
        "## Key Services\n- Compute: EC2, Lambda (serverless), App Engine\n- Storage: S3, Blob Storage, Cloud Storage\n- Database: RDS, DynamoDB, Firestore\n- Networking: VPC, Load Balancers, CDN\n- DevOps: CodePipeline, Cloud Build"
    ],
    "Cyber Security": [
        "## Security Fundamentals\n- CIA Triad: Confidentiality, Integrity, Availability\n- Authentication vs Authorization\n- Encryption: symmetric (AES) vs asymmetric (RSA)\n- Hashing: SHA-256, bcrypt for passwords\n- HTTPS, SSL/TLS certificates",
        "## Common Threats & Defense\n- SQL Injection: parameterized queries\n- XSS: Cross-Site Scripting, sanitize inputs\n- CSRF: Cross-Site Request Forgery, tokens\n- DDoS attacks and mitigation\n- OWASP Top 10 vulnerabilities"
    ],
    "DevOps": [
        "## DevOps Culture & Tools\n- CI/CD: Continuous Integration/Deployment\n- Jenkins, GitHub Actions, GitLab CI\n- Docker: containers, Dockerfile, docker-compose\n- Kubernetes: container orchestration, pods, services\n- Infrastructure as Code: Terraform, Ansible",
        "## Monitoring & Deployment\n- Logging: ELK Stack (Elasticsearch, Logstash, Kibana)\n- Monitoring: Prometheus, Grafana\n- Deployment strategies: blue-green, canary, rolling\n- Configuration management\n- Site Reliability Engineering (SRE) practices"
    ],
    "Operating Systems": [
        "## OS Fundamentals\n- Process management: creation, scheduling, termination\n- CPU scheduling: FCFS, SJN, Round Robin, Priority\n- Memory management: paging, segmentation\n- Virtual memory: page tables, page faults\n- File systems: FAT, NTFS, ext4",
        "## Concurrency & Synchronization\n- Threads vs Processes\n- Mutex, Semaphore, Monitor\n- Deadlock: conditions, prevention, avoidance\n- Producer-Consumer problem\n- Disk scheduling: SCAN, C-SCAN, SSTF"
    ],
    "Computer Networks": [
        "## Network Fundamentals\n- OSI Model: 7 layers (Physical to Application)\n- TCP/IP Model: 4 layers\n- IP addressing: IPv4, IPv6, subnetting\n- DNS: domain name resolution\n- HTTP/HTTPS: request-response protocol",
        "## Protocols & Security\n- TCP vs UDP: reliable vs fast\n- DHCP: automatic IP assignment\n- NAT: Network Address Translation\n- Firewalls, VPN, proxy servers\n- Socket programming basics"
    ],
    "System Design": [
        "## Design Principles\n- Scalability: horizontal vs vertical scaling\n- Load balancing: round-robin, least connections\n- Caching: Redis, Memcached, CDN\n- Database: SQL vs NoSQL, sharding, replication\n- Message queues: Kafka, RabbitMQ",
        "## Common System Designs\n- URL shortener: hash + database + redirect\n- Chat application: WebSockets, message queues\n- Social media feed: fan-out, timeline generation\n- File storage: distributed storage, chunking\n- Rate limiter: token bucket, sliding window"
    ],
    "Blockchain": [
        "## Blockchain Basics\n- Distributed ledger technology\n- Block: data, hash, previous hash\n- Consensus mechanisms: PoW, PoS\n- Mining and transaction validation\n- Cryptocurrency: Bitcoin, Ethereum",
        "## Smart Contracts & DApps\n- Solidity programming language\n- Ethereum Virtual Machine (EVM)\n- DeFi: decentralized finance\n- NFTs: non-fungible tokens\n- Web3.js: blockchain interaction"
    ],
    "Kotlin": [
        "## Kotlin Fundamentals\n- Modern JVM language by JetBrains\n- val (immutable) vs var (mutable)\n- Null safety: ?, !!, let, elvis operator\n- Data classes: automatic equals/hashCode/toString\n- When expression (enhanced switch)",
        "## Kotlin for Android\n- Activity lifecycle, Fragments\n- Coroutines for async programming\n- Jetpack Compose: declarative UI\n- Retrofit for networking\n- Room for local database"
    ],
    "R Programming": [
        "## R Basics\n- Statistical computing language\n- Vectors, matrices, data frames, lists\n- Functions: function(x) { ... }\n- Packages: install.packages(), library()\n- Popular: ggplot2, dplyr, tidyr, caret",
        "## Data Analysis in R\n- read.csv(), read.table() for data loading\n- dplyr: filter(), select(), mutate(), summarize()\n- ggplot2: grammar of graphics, aes(), geom_point()\n- Statistical tests: t.test(), cor.test(), lm()\n- R Markdown for reproducible reports"
    ],
    "UI/UX Design": [
        "## UX Research & Principles\n- User-centered design methodology\n- User personas and journey mapping\n- Heuristic evaluation (Nielsen's 10 heuristics)\n- Usability testing: A/B tests, heat maps\n- Information architecture and card sorting",
        "## UI Design Fundamentals\n- Color theory: complementary, analogous, triadic\n- Typography: font pairing, hierarchy, readability\n- Layout: grid systems, whitespace, visual balance\n- Design systems: components, tokens, documentation\n- Tools: Figma, Adobe XD, Sketch",
        "## Prototyping & Wireframing\n- Low-fidelity vs high-fidelity prototypes\n- Wireframe tools: Balsamiq, Figma, Whimsical\n- Interactive prototyping with micro-interactions\n- Design handoff to developers\n- Responsive design principles"
    ],
    "Mobile App Development": [
        "## Mobile Development Fundamentals\n- Native vs Cross-platform approaches\n- React Native: JavaScript-based, hot reload\n- Flutter: Dart language, widget-based UI\n- Mobile app lifecycle and navigation\n- Platform-specific guidelines (Material Design, HIG)",
        "## Building Mobile UIs\n- Component-based architecture\n- State management in mobile apps\n- Responsive layouts for different screen sizes\n- Animations and gestures\n- Accessibility in mobile apps",
        "## Mobile Backend & Deployment\n- REST API integration and offline support\n- Push notifications: FCM, APNs\n- Local storage: SQLite, AsyncStorage, Hive\n- App Store and Play Store deployment\n- CI/CD for mobile: Fastlane, Codemagic"
    ],
    "API Development": [
        "## REST API Design\n- HTTP methods: GET, POST, PUT, PATCH, DELETE\n- Status codes: 2xx success, 4xx client error, 5xx server\n- Resource naming conventions and URL structure\n- Query parameters vs path parameters\n- Versioning: /api/v1/, header-based",
        "## Authentication & Security\n- API keys and rate limiting\n- OAuth 2.0 flows: authorization code, client credentials\n- JWT: header.payload.signature structure\n- CORS: Cross-Origin Resource Sharing\n- Input validation and sanitization",
        "## API Documentation & Testing\n- OpenAPI/Swagger specification\n- Postman: collections, environments, tests\n- API testing: unit, integration, contract\n- GraphQL vs REST comparison\n- WebSockets for real-time communication"
    ]
}

def generate_notes_for_course(course_name):
    if course_name in COURSE_NOTES:
        return COURSE_NOTES[course_name]
    return [
        f"## {course_name} — Introduction\n- What is {course_name} and why learn it?\n- Industry applications and career scope\n- Key terminology and concepts\n- Recommended prerequisites",
        f"## {course_name} — Core Concepts\n- Fundamental principles and theory\n- Building blocks and architecture\n- Common patterns and best practices\n- Hands-on setup and configuration",
        f"## {course_name} — Intermediate Topics\n- Advanced techniques and optimization\n- Real-world project implementation\n- Debugging and troubleshooting\n- Performance considerations",
        f"## {course_name} — Mastery & Projects\n- Industry-level project ideas\n- Interview preparation topics\n- Resources for continued learning\n- Certification and portfolio tips"
    ]


@features_bp.route('/notes/generate', methods=['POST'])
@jwt_required()
def generate_notes():
    data = request.get_json(silent=True) or {}
    course = data.get('course', '')
    if not course:
        return jsonify({"error": "Course name is required"}), 400
    notes_content = generate_notes_for_course(course)
    current_email = get_jwt_identity()
    notes_collection.insert_one({
        "email": current_email, "course": course,
        "notes": notes_content, "created_at": datetime.utcnow().isoformat(), "is_custom": False
    })
    return jsonify({"course": course, "notes": notes_content, "sections": len(notes_content)}), 200


@features_bp.route('/notes/search', methods=['GET'])
def search_notes():
    """Search across ALL course notes like Google"""
    query = request.args.get('q', '').lower().strip()
    if not query or len(query) < 2:
        return jsonify({"results": [], "message": "Enter at least 2 characters"}), 200
    
    results = []
    for course_name, sections in COURSE_NOTES.items():
        for i, section in enumerate(sections):
            if query in section.lower():
                lines = section.split('\n')
                title = lines[0].replace('## ', '')
                # Find matching lines
                matching_lines = [l.strip() for l in lines if query in l.lower()]
                results.append({
                    "course": course_name,
                    "section": i + 1,
                    "title": title,
                    "matches": matching_lines[:3],
                    "full_content": section
                })
    
    results.sort(key=lambda x: len(x["matches"]), reverse=True)
    return jsonify({"results": results[:20], "total": len(results), "query": query}), 200


@features_bp.route('/notes/save', methods=['POST'])
@jwt_required()
def save_custom_note():
    data = request.get_json(silent=True) or {}
    current_email = get_jwt_identity()
    note = {
        "email": current_email, "course": data.get('course', 'General'),
        "title": data.get('title', 'Untitled Note'), "content": data.get('content', ''),
        "created_at": datetime.utcnow().isoformat(), "is_custom": True
    }
    notes_collection.insert_one(note)
    return jsonify({"message": "Note saved!", "note": note}), 200


@features_bp.route('/notes/list', methods=['GET'])
@jwt_required()
def list_notes():
    current_email = get_jwt_identity()
    user_notes = notes_collection.find({"email": current_email})
    for n in user_notes:
        if isinstance(n, dict):
            n.pop('_id', None)
    return jsonify({"notes": user_notes}), 200


# ═══════════════════════════════════════════════════════
#  3. PEER LEARNING & STUDY ROOMS
# ═══════════════════════════════════════════════════════

# Seed default study rooms
DEFAULT_ROOMS = [
    {"id": "python-beginners", "name": "🐍 Python Beginners", "topic": "Python", "members": [], "messages": [], "max_members": 20},
    {"id": "web-dev", "name": "🌐 Web Development", "topic": "HTML/CSS/JS", "members": [], "messages": [], "max_members": 20},
    {"id": "ml-ai", "name": "🤖 ML & AI Study Group", "topic": "Machine Learning", "members": [], "messages": [], "max_members": 20},
    {"id": "dsa-masters", "name": "📊 DSA Problem Solving", "topic": "Data Structures", "members": [], "messages": [], "max_members": 20},
    {"id": "interview-prep", "name": "💼 Interview Preparation", "topic": "System Design", "members": [], "messages": [], "max_members": 20},
    {"id": "project-collab", "name": "🚀 Project Collaboration", "topic": "Full Stack", "members": [], "messages": [], "max_members": 15},
]

def seed_rooms():
    if study_rooms_collection.count_documents({}) == 0:
        for room in DEFAULT_ROOMS:
            study_rooms_collection.insert_one(room.copy())

seed_rooms()


@features_bp.route('/rooms', methods=['GET'])
def get_study_rooms():
    """List all study rooms"""
    rooms = study_rooms_collection.find({})
    result = []
    for r in rooms:
        if isinstance(r, dict):
            r.pop('_id', None)
            result.append({
                "id": r.get("id", ""),
                "name": r.get("name", ""),
                "topic": r.get("topic", ""),
                "member_count": len(r.get("members", [])),
                "max_members": r.get("max_members", 20),
                "message_count": len(r.get("messages", []))
            })
    return jsonify({"rooms": result}), 200


@features_bp.route('/rooms/join', methods=['POST'])
@jwt_required()
def join_room():
    """Join a study room"""
    data = request.get_json(silent=True) or {}
    room_id = data.get('room_id', '')
    current_email = get_jwt_identity()
    user = users_collection.find_one({"email": current_email})
    user_name = "Anonymous"
    if isinstance(user, dict):
        user_name = user.get("name", "Anonymous")
    
    room = study_rooms_collection.find_one({"id": room_id})
    if not isinstance(room, dict):
        return jsonify({"error": "Room not found"}), 404
    
    members = room.get("members", [])
    if current_email not in members:
        members.append(current_email)
        study_rooms_collection.update_one(
            {"id": room_id},
            {"$set": {"members": members}}
        )
    
    return jsonify({
        "message": f"{user_name} joined the room!",
        "member_count": len(members)
    }), 200


@features_bp.route('/rooms/chat', methods=['POST'])
@jwt_required()
def room_chat():
    """Send a message in a study room"""
    data = request.get_json(silent=True) or {}
    room_id = data.get('room_id', '')
    message = data.get('message', '')
    current_email = get_jwt_identity()
    
    user = users_collection.find_one({"email": current_email})
    user_name = "Anonymous"
    if isinstance(user, dict):
        user_name = user.get("name", "Anonymous")
    
    room = study_rooms_collection.find_one({"id": room_id})
    if not isinstance(room, dict):
        return jsonify({"error": "Room not found"}), 404
    
    messages = room.get("messages", [])
    chat_msg = {
        "user": user_name,
        "email": current_email,
        "text": message,
        "time": datetime.utcnow().strftime("%H:%M")
    }
    messages.append(chat_msg)
    
    # Keep last 50 messages
    if len(messages) > 50:
        messages = messages[-50:]
    
    study_rooms_collection.update_one(
        {"id": room_id},
        {"$set": {"messages": messages}}
    )
    
    return jsonify({"messages": messages}), 200


@features_bp.route('/rooms/messages', methods=['GET'])
def get_room_messages():
    """Get messages from a study room"""
    room_id = request.args.get('room_id', '')
    room = study_rooms_collection.find_one({"id": room_id})
    if not isinstance(room, dict):
        return jsonify({"error": "Room not found"}), 404
    
    return jsonify({"messages": room.get("messages", [])}), 200


# ═══════════════════════════════════════════════════════
#  4. LEARNING ANALYTICS DASHBOARD
# ═══════════════════════════════════════════════════════

@features_bp.route('/analytics', methods=['GET'])
@jwt_required()
def get_analytics():
    """Get detailed learning analytics for the user"""
    current_email = get_jwt_identity()
    user = users_collection.find_one({"email": current_email})
    
    if not isinstance(user, dict):
        return jsonify({"error": "User not found"}), 404
    
    xp = int(user.get("xp", 0))
    completed = int(user.get("completed_courses", 0))
    streak = int(user.get("streak", 0))
    
    # Calculate analytics
    total_courses = 31
    progress_pct = round((completed / total_courses) * 100, 1)
    avg_xp_per_course = round(xp / max(completed, 1), 1)
    
    # Mood history
    mood_entries = moods_collection.find({"email": current_email})
    mood_counts = {}
    for m in mood_entries:
        if isinstance(m, dict):
            mood = m.get("mood", "Neutral")
            mood_counts[mood] = mood_counts.get(mood, 0) + 1
    
    dominant_mood = max(mood_counts, key=mood_counts.get) if mood_counts else "Neutral"
    
    # Study time estimate (based on completed courses)
    est_hours = completed * 8  # ~8 hours per course average
    
    # Skill radar data
    skill_categories = {
        "Frontend": ["HTML", "CSS", "JavaScript", "React JS"],
        "Backend": ["Python", "Node JS", "Express JS", "Flask", "Django"],
        "Database": ["SQL", "MongoDB"],
        "AI/ML": ["AI Basics", "Machine Learning", "Deep Learning", "Data Science"],
        "DevOps": ["Git & GitHub", "Cloud Computing", "DevOps"],
        "CS Core": ["Data Structures", "Algorithms", "OOP", "Operating Systems", "Computer Networks", "System Design"]
    }
    
    completed_list = user.get("completed_list", [])
    skill_scores = {}
    for category, courses_in_cat in skill_categories.items():
        done_in_cat = len([c for c in courses_in_cat if c in completed_list])
        total_in_cat = len(courses_in_cat)
        skill_scores[category] = round((done_in_cat / max(total_in_cat, 1)) * 100)
    
    return jsonify({
        "xp": xp,
        "completed": completed,
        "total_courses": total_courses,
        "progress_pct": progress_pct,
        "streak": streak,
        "level": get_level(xp),
        "avg_xp_per_course": avg_xp_per_course,
        "est_study_hours": est_hours,
        "dominant_mood": dominant_mood,
        "mood_distribution": mood_counts,
        "skill_scores": skill_scores,
        "notes_count": notes_collection.count_documents({"email": current_email}),
        "rooms_joined": len([r for r in study_rooms_collection.find({}) if isinstance(r, dict) and current_email in r.get("members", [])])
    }), 200


# ═══════════════════════════════════════════════════════
#  5. AI MOCK INTERVIEW
# ═══════════════════════════════════════════════════════

INTERVIEW_QUESTIONS = {
    "Python": [
        {"q": "What are Python decorators and how do you create one?", "key_points": ["function wrapper", "@syntax", "closures", "accepts function as argument"]},
        {"q": "Explain the difference between list, tuple, set, and dictionary.", "key_points": ["mutable vs immutable", "ordered vs unordered", "key-value pairs", "duplicates"]},
        {"q": "What is the GIL in Python and how does it affect multithreading?", "key_points": ["Global Interpreter Lock", "one thread at a time", "CPU-bound", "use multiprocessing"]},
        {"q": "How does Python handle memory management?", "key_points": ["reference counting", "garbage collector", "memory pool", "private heap"]},
        {"q": "What are generators in Python and when would you use them?", "key_points": ["yield keyword", "lazy evaluation", "memory efficient", "iterator protocol"]},
    ],
    "JavaScript": [
        {"q": "Explain closures in JavaScript with an example.", "key_points": ["inner function", "outer scope access", "data privacy", "lexical environment"]},
        {"q": "What is the event loop in JavaScript?", "key_points": ["call stack", "callback queue", "microtask queue", "non-blocking"]},
        {"q": "Explain prototypal inheritance in JavaScript.", "key_points": ["prototype chain", "__proto__", "Object.create", "constructor"]},
        {"q": "What are Promises and how do they work?", "key_points": ["pending/fulfilled/rejected", "then/catch/finally", "async/await", "chaining"]},
        {"q": "Explain the difference between == and === in JavaScript.", "key_points": ["type coercion", "strict equality", "no conversion", "best practice"]},
    ],
    "Data Structures": [
        {"q": "Compare Array vs Linked List. When would you use each?", "key_points": ["random access", "O(1) vs O(n)", "insertion/deletion", "memory contiguous"]},
        {"q": "Explain how a Hash Table works and handle collisions.", "key_points": ["hash function", "buckets", "chaining", "open addressing", "O(1) average"]},
        {"q": "What is a Binary Search Tree and its time complexities?", "key_points": ["left < root < right", "O(log n) search", "balanced vs unbalanced", "in-order traversal"]},
        {"q": "Explain BFS vs DFS traversal with use cases.", "key_points": ["queue vs stack", "level-order vs depth", "shortest path", "cycle detection"]},
        {"q": "What is a Stack and give real-world examples.", "key_points": ["LIFO", "push/pop", "undo functionality", "expression evaluation", "call stack"]},
    ],
    "System Design": [
        {"q": "How would you design a URL shortener like bit.ly?", "key_points": ["hash function", "base62 encoding", "database", "redirect 301", "analytics"]},
        {"q": "Design a real-time chat application architecture.", "key_points": ["WebSockets", "message queue", "presence", "database schema", "load balancing"]},
        {"q": "Explain horizontal vs vertical scaling with trade-offs.", "key_points": ["add machines vs upgrade", "cost", "complexity", "single point of failure"]},
        {"q": "How does a CDN work and why is it important?", "key_points": ["edge servers", "caching", "latency reduction", "geographic distribution"]},
        {"q": "Design a notification system for a social media app.", "key_points": ["push vs pull", "priority queue", "fan-out", "user preferences", "batching"]},
    ],
    "Machine Learning": [
        {"q": "Explain the bias-variance tradeoff.", "key_points": ["underfitting vs overfitting", "model complexity", "training vs test error", "regularization"]},
        {"q": "How does a Random Forest algorithm work?", "key_points": ["ensemble", "bagging", "multiple decision trees", "majority voting", "feature sampling"]},
        {"q": "What is gradient descent and its variants?", "key_points": ["optimization", "learning rate", "batch/stochastic/mini-batch", "convergence"]},
        {"q": "Explain precision, recall, and F1-score.", "key_points": ["true positives", "false positives", "false negatives", "harmonic mean"]},
        {"q": "What is cross-validation and why is it useful?", "key_points": ["k-fold", "prevent overfitting", "robust evaluation", "stratified"]},
    ]
}

# Generic questions for courses without specific bank
GENERIC_QUESTIONS = [
    {"q": "Explain the core concepts and fundamentals of this technology.", "key_points": ["basics", "principles", "architecture", "use cases"]},
    {"q": "What are the best practices when working with this technology?", "key_points": ["conventions", "patterns", "performance", "security"]},
    {"q": "Describe a real-world project you would build with this technology.", "key_points": ["requirements", "architecture", "implementation", "testing"]},
    {"q": "What are the common challenges and how to overcome them?", "key_points": ["debugging", "performance", "scalability", "learning curve"]},
    {"q": "How does this technology compare to its alternatives?", "key_points": ["pros and cons", "use cases", "ecosystem", "community"]},
]


@features_bp.route('/interview/start', methods=['POST'])
@jwt_required()
def start_interview():
    """Start an AI mock interview session"""
    data = request.get_json(silent=True) or {}
    course = data.get('course', 'Python')
    difficulty = data.get('difficulty', 'intermediate')
    
    questions = INTERVIEW_QUESTIONS.get(course, GENERIC_QUESTIONS)
    # Shuffle and pick 5 questions
    selected = random.sample(questions, min(5, len(questions)))
    
    current_email = get_jwt_identity()
    session_id = f"interview_{current_email}_{datetime.utcnow().strftime('%Y%m%d%H%M%S')}"
    
    session = {
        "session_id": session_id,
        "email": current_email,
        "course": course,
        "difficulty": difficulty,
        "questions": selected,
        "answers": [],
        "scores": [],
        "started_at": datetime.utcnow().isoformat(),
        "status": "in_progress"
    }
    interview_collection.insert_one(session)
    
    # Return only questions (not key_points to prevent cheating)
    return jsonify({
        "session_id": session_id,
        "course": course,
        "questions": [{"index": i, "question": q["q"]} for i, q in enumerate(selected)],
        "total": len(selected)
    }), 200


@features_bp.route('/interview/answer', methods=['POST'])
@jwt_required()
def submit_answer():
    """Submit an answer for grading"""
    data = request.get_json(silent=True) or {}
    session_id = data.get('session_id', '')
    q_index = int(data.get('question_index', 0))
    answer = data.get('answer', '')
    
    session = interview_collection.find_one({"session_id": session_id})
    if not isinstance(session, dict):
        return jsonify({"error": "Session not found"}), 404
    
    questions = session.get("questions", [])
    if q_index >= len(questions):
        return jsonify({"error": "Invalid question index"}), 400
    
    question_data = questions[q_index]
    key_points = question_data.get("key_points", [])
    
    # Score the answer
    answer_lower = answer.lower()
    points_hit = 0
    feedback_items = []
    
    for kp in key_points:
        kp_lower = kp.lower()
        # Check if key concept is mentioned (flexible matching)
        words = kp_lower.split()
        matched = any(w in answer_lower for w in words if len(w) > 3)
        if matched:
            points_hit += 1
            feedback_items.append(f"✅ Covered: {kp}")
        else:
            feedback_items.append(f"❌ Missing: {kp}")
    
    # Calculate score out of 10
    raw_score = (points_hit / max(len(key_points), 1)) * 10
    
    # Bonus for length and detail
    length_bonus = min(len(answer.split()) / 50, 1.0)
    final_score = min(round(raw_score * 0.7 + length_bonus * 3, 1), 10)
    
    # Rating
    if final_score >= 8: rating = "Excellent"
    elif final_score >= 6: rating = "Good"
    elif final_score >= 4: rating = "Average"
    else: rating = "Needs Improvement"
    
    # Store answer
    answers = session.get("answers", [])
    scores = session.get("scores", [])
    answers.append({"index": q_index, "answer": answer})
    scores.append({"index": q_index, "score": final_score, "rating": rating})
    
    interview_collection.update_one(
        {"session_id": session_id},
        {"$set": {"answers": answers, "scores": scores}}
    )
    
    return jsonify({
        "score": final_score,
        "rating": rating,
        "feedback": feedback_items,
        "tip": f"Try to mention: {', '.join(key_points)}" if final_score < 6 else "Great answer! Keep it up."
    }), 200


@features_bp.route('/interview/results', methods=['GET'])
@jwt_required()
def get_results():
    """Get interview session results"""
    session_id = request.args.get('session_id', '')
    session = interview_collection.find_one({"session_id": session_id})
    if not isinstance(session, dict):
        return jsonify({"error": "Session not found"}), 404
    
    scores = session.get("scores", [])
    total = sum(s.get("score", 0) for s in scores)
    avg = round(total / max(len(scores), 1), 1)
    
    if avg >= 8: overall = "🏆 Interview Ready!"
    elif avg >= 6: overall = "👍 Good, practice more"
    elif avg >= 4: overall = "📚 Needs more preparation"
    else: overall = "⚠️ Study core concepts first"
    
    return jsonify({
        "session_id": session_id,
        "course": session.get("course", ""),
        "scores": scores,
        "average_score": avg,
        "overall_rating": overall,
        "total_questions": len(session.get("questions", []))
    }), 200
