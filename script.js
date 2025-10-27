// Initialize Supabase
const SUPABASE_URL = 'https://iflpjsutvfrwfjkggbhc.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlmbHBqc3V0dmZyd2Zqa2dnYmhjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE1MTYzOTgsImV4cCI6MjA3NzA5MjM5OH0.UiP3C06r1TWXgqtsqjH6OLn9bkDN56Gwbd3Mtvb3HaE';

// Initialize Supabase client (with error handling)
let supabase;

function initSupabase() {
    try {
        console.log('Attempting to initialize Supabase...');
        console.log('window.supabase:', window.supabase);
        
        // Try different possible ways the CDN might expose the library
        if (window.supabase && window.supabase.createClient) {
            supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
            console.log('✅ Supabase initialized successfully via window.supabase');
            return true;
        } else if (typeof createClient !== 'undefined') {
            supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
            console.log('✅ Supabase initialized successfully via createClient');
            return true;
        } else {
            console.error('❌ Supabase library not loaded. Available window properties:', Object.keys(window).filter(k => k.toLowerCase().includes('supabase')));
            return false;
        }
    } catch (error) {
        console.error('❌ Error initializing Supabase:', error);
        return false;
    }
}

// Try to initialize immediately (will retry in DOMContentLoaded if needed)
initSupabase();

// Global variables
let currentModule = 1;
let currentSection = 0;
let currentUser = null;
let userProgress = {
    modulesCompleted: 0,
    quizzesPassed: 0,
    timeSpent: 0,
    completedModules: [],
    quizzesCompleted: [], // Track which module quizzes have been passed
    streak: 0,
    lastActiveDate: null
};

// Authentication state
let authState = {
    isAuthenticated: false,
    user: null,
    provider: null
};

// Module content data
const moduleContent = {
    1: {
        title: "Foundations of Financial Literacy",
        sections: [
            {
                title: "What is Financial Literacy?",
                content: `
                    <div class="module-section">
                        <h3>What is Financial Literacy?</h3>
                        <p>In simple terms, financial literacy allows you to understand and manage your money. This includes your daily expenses, savings, borrowing, and investing. Being financially literate will help you budget effectively.</p>
                        
                        <div class="highlight-box">
                            <h4>💡 Key Takeaway</h4>
                            <p>Financial literacy is about understanding money management, not just earning more money. It's the foundation for making informed decisions about your finances.</p>
                        </div>
                    </div>
                `
            },
            {
                title: "The Psychology of Money",
                content: `
                    <div class="module-section">
                        <h3>The Psychology of Money</h3>
                        <p>You can only budget effectively if you understand the reasons behind your purchases. The first step is differentiating between financial needs and wants.</p>
                        
                        <p>Money decisions are often emotional rather than logical, which means people don't always spend rationally. Factors such as fear, greed, pride, guilt, and even childhood experiences can strongly influence how we spend, save, or invest.</p>
                        
                        <h4>Key Psychological Factors:</h4>
                        <ul>
                            <li><strong>Personal History:</strong> Someone who grew up with parents living paycheck to paycheck or in debt may be highly cautious with money, while someone else raised in a financially stable home may take bigger risks.</li>
                            <li><strong>Perception vs. Reality:</strong> Wealth isn't only about how much you have, but how you feel about it. Some people feel rich with little, while others never feel secure, even with millions.</li>
                            <li><strong>Spending vs. Saving:</strong> Our brains tend to prefer instant gratification (purchasing now) over delayed gratification (saving for the future), which is why saving and investing can often feel challenging.</li>
                            <li><strong>Social Comparisons:</strong> People judge their financial success relative to others, not just by their own absolute wealth. If you hang out with people who own designer bags and travel with chauffeurs, you'll want the same. This leads to lifestyle inflation—spending more as income rises.</li>
                            <li><strong>Value of Money:</strong> The ultimate benefit of money isn't buying expensive items, but the freedom to control your time and choices. For example, you don't have to work overtime if you have savings in your account; instead, you can spend that time with family and friends.</li>
                        </ul>
                        
                        <p style="margin-top: 1.5rem;"><em>In short, the psychology of money shows how understanding human behavior is as important—sometimes even more—than knowing financial math.</em></p>
                        
                        <div class="example-box">
                            <h4>📚 Great Read</h4>
                            <p>Morgan Housel's book <strong>"The Psychology of Money"</strong> provides excellent insights into how emotions and behavior affect financial decisions.</p>
                        </div>
                    </div>
                `
            },
            {
                title: "Setting SMART Financial Goals",
                content: `
                    <div class="module-section">
                        <h3>Setting SMART Financial Goals</h3>
                        <p>Before you can budget, invest, or save, you need to know what you're working toward. Without clear goals, you'll be spending on random expenses like Uber Eats, subscriptions, or impulse shopping with no checks and balances.</p>
                        
                        <div class="highlight-box">
                            <h4>📊 Research Shows</h4>
                            <p>A study conducted at Michigan showed that setting clear goals and checking in on progress increased the success rate by 33%.</p>
                        </div>
                        
                        <h4>SMART Goals Breakdown:</h4>
                        <ul>
                            <li><strong>S</strong>pecific → Clear and detailed, not vague</li>
                            <li><strong>M</strong>easurable → You can track progress with numbers</li>
                            <li><strong>A</strong>chievable → Realistic given your income and lifestyle</li>
                            <li><strong>R</strong>elevant → Aligned with what actually matters to you (not influenced by social media or your social circle)</li>
                            <li><strong>T</strong>ime-bound → Set a clear deadline</li>
                        </ul>
                        
                        <h4 style="margin-top: 2rem;">Travel Example:</h4>
                        <div class="example-box">
                            <h4>❌ Vague Goal:</h4>
                            <p>"I want to travel to Italy."</p>
                            <p><em>Problem: Easy to push off forever.</em></p>
                        </div>
                        
                        <div class="highlight-box">
                            <h4>✅ SMART Goal:</h4>
                            <p>"I will save $1,500 in 9 months for a trip to Italy by putting aside $40/week."</p>
                            <p><em>Makes travel realistic without going into debt.</em></p>
                        </div>
                        
                        <h4 style="margin-top: 2rem;">Career/Grad School Example:</h4>
                        <div class="example-box">
                            <h4>❌ Vague Goal:</h4>
                            <p>"I want to study at an Ivy League school."</p>
                            <p><em>Problem: No clear direction on how to pay for tuition.</em></p>
                        </div>
                        
                        <div class="highlight-box">
                            <h4>✅ SMART Goal:</h4>
                            <p>"I will save $500/month for the next 18 months to cover $9,000 of grad school expenses without taking additional loans."</p>
                        </div>
                        
                        <div class="quiz-container" style="margin-top: 2rem;">
                            <h4>🎯 Exercise: Create Your Own SMART Goals</h4>
                            <ol>
                                <li><strong>Brainstorm</strong> three things you want most in the next 1–3 years.
                                    <ul style="margin-top: 0.5rem;">
                                        <li>Examples: Pay off a credit card, save for a car, build an emergency fund, move into your own apartment, or save for travel.</li>
                            </ul>
                                </li>
                                <li><strong>Turn each into a SMART goal.</strong> Write it down. Break it into smaller monthly or weekly targets.</li>
                                <li><strong>Prioritize.</strong> Ask: Which goal matters most right now? Focus on one or two at a time so you don't feel overwhelmed.</li>
                            </ol>
                        </div>
                    </div>
                `
            },
            {
                title: "Module 1 Quiz",
                content: `
                    <div class="quiz-container">
                        <h3>Module 1 Quiz</h3>
                        <p><em>Please note, this is purely a self-graded quiz and only aims to help you assess your understanding of the Module. Should you get a score below 5/7, consider reviewing the Module and the provided links again to improve your understanding of the topic.</em></p>
                        
                        <h4 style="margin-top: 2rem; color: var(--primary-color);">Part A: Multiple Choice (4 questions)</h4>
                        
                        <div class="quiz-question" style="margin-top: 1.5rem;">
                            <strong>Question 1:</strong> What does financial literacy primarily help you do?
                        </div>
                        <div class="quiz-options">
                            <div class="quiz-option">
                                <input type="radio" name="q1" value="A" id="q1a">
                                <label for="q1a">A. Spend money on luxury items</label>
                            </div>
                            <div class="quiz-option">
                                <input type="radio" name="q1" value="B" id="q1b">
                                <label for="q1b">B. Budget and manage money effectively</label>
                            </div>
                            <div class="quiz-option">
                                <input type="radio" name="q1" value="C" id="q1c">
                                <label for="q1c">C. Avoid all debt permanently</label>
                            </div>
                            <div class="quiz-option">
                                <input type="radio" name="q1" value="D" id="q1d">
                                <label for="q1d">D. Make more friends</label>
                            </div>
                        </div>
                        
                        <div class="quiz-question">
                            <strong>Question 2:</strong> Which of the following is an example of a financial want rather than a need?
                        </div>
                        <div class="quiz-options">
                            <div class="quiz-option">
                                <input type="radio" name="q2" value="A" id="q2a">
                                <label for="q2a">A. Groceries</label>
                            </div>
                            <div class="quiz-option">
                                <input type="radio" name="q2" value="B" id="q2b">
                                <label for="q2b">B. Rent</label>
                            </div>
                            <div class="quiz-option">
                                <input type="radio" name="q2" value="C" id="q2c">
                                <label for="q2c">C. Uber Eats delivery</label>
                            </div>
                            <div class="quiz-option">
                                <input type="radio" name="q2" value="D" id="q2d">
                                <label for="q2d">D. Utility bills</label>
                            </div>
                        </div>
                        
                        <div class="quiz-question">
                            <strong>Question 3:</strong> Which of the following is NOT a component of a SMART financial goal?
                        </div>
                        <div class="quiz-options">
                            <div class="quiz-option">
                                <input type="radio" name="q3" value="A" id="q3a">
                                <label for="q3a">A. Measurable</label>
                            </div>
                            <div class="quiz-option">
                                <input type="radio" name="q3" value="B" id="q3b">
                                <label for="q3b">B. Achievable</label>
                            </div>
                            <div class="quiz-option">
                                <input type="radio" name="q3" value="C" id="q3c">
                                <label for="q3c">C. Flexible</label>
                            </div>
                            <div class="quiz-option">
                                <input type="radio" name="q3" value="D" id="q3d">
                                <label for="q3d">D. Time-bound</label>
                            </div>
                        </div>
                        
                        <div class="quiz-question">
                            <strong>Question 4:</strong> Alex earns $45,000/year as a marketing assistant and makes $500/month driving Uber. What type of income are both of these?
                        </div>
                        <div class="quiz-options">
                            <div class="quiz-option">
                                <input type="radio" name="q4" value="A" id="q4a">
                                <label for="q4a">A. Passive income</label>
                            </div>
                            <div class="quiz-option">
                                <input type="radio" name="q4" value="B" id="q4b">
                                <label for="q4b">B. Active income</label>
                            </div>
                            <div class="quiz-option">
                                <input type="radio" name="q4" value="C" id="q4c">
                                <label for="q4c">C. Investment income</label>
                            </div>
                            <div class="quiz-option">
                                <input type="radio" name="q4" value="D" id="q4d">
                                <label for="q4d">D. Bonus income</label>
                            </div>
                        </div>
                        
                        <h4 style="margin-top: 2rem; color: var(--primary-color);">Part B: True or False (3 questions)</h4>
                        
                        <div class="quiz-question" style="margin-top: 1.5rem;">
                            <strong>Question 5:</strong> Money decisions are always rational and based purely on logic.
                        </div>
                        <div class="quiz-options">
                            <div class="quiz-option">
                                <input type="radio" name="q5" value="True" id="q5t">
                                <label for="q5t">True</label>
                            </div>
                            <div class="quiz-option">
                                <input type="radio" name="q5" value="False" id="q5f">
                                <label for="q5f">False</label>
                            </div>
                        </div>
                        
                        <div class="quiz-question">
                            <strong>Question 6:</strong> Lifestyle inflation happens when people increase spending as their income grows.
                        </div>
                        <div class="quiz-options">
                            <div class="quiz-option">
                                <input type="radio" name="q6" value="True" id="q6t">
                                <label for="q6t">True</label>
                            </div>
                            <div class="quiz-option">
                                <input type="radio" name="q6" value="False" id="q6f">
                                <label for="q6f">False</label>
                            </div>
                        </div>
                        
                        <div class="quiz-question">
                            <strong>Question 7:</strong> Dividends from stocks and royalties from music are examples of passive income.
                        </div>
                        <div class="quiz-options">
                            <div class="quiz-option">
                                <input type="radio" name="q7" value="True" id="q7t">
                                <label for="q7t">True</label>
                            </div>
                            <div class="quiz-option">
                                <input type="radio" name="q7" value="False" id="q7f">
                                <label for="q7f">False</label>
                            </div>
                        </div>
                        
                        <button class="btn btn-primary" onclick="checkQuiz(1)" style="margin-top: 2rem;">Check Answers</button>
                        <div id="quiz-results-1"></div>
                    </div>
                `
            }
        ]
    },
    2: {
        title: "Budgeting and Money Management",
        sections: [
            {
                title: "How to Create a Budget",
                content: `
                    <div class="module-section">
                        <h3>Why Budgeting Matters</h3>
                        <p>Imagine getting paid on Friday, and by Monday, half your money's gone, and the worst part, you're not even sure where it went. This scenario is all too common, with <strong>30% of Gen Z not budgeting their money</strong>. The result? Financial uncertainty and stress.</p>
                        
                        <p>Contrary to popular belief, budgeting is not a complex task. It's simply a plan for where your money is going. It's not about saying "no" to spending on fun things. It's just about knowing where your money goes and being fully in control. It's a straightforward process that anyone can master.</p>
                        
                        <div class="highlight-box">
                            <h4>📊 The Reality</h4>
                            <p>Without a budget, it's easy to end up paycheck-to-paycheck, as <strong>67% of American adults do</strong>, according to PYMNTS. With a budget, even without substantial income, you can:</p>
                            <ul>
                                <li>Pay bills on time</li>
                                <li>Avoid overdraft fees</li>
                                <li>Save up for things such as a car or even a vacation</li>
                                <li>Avoid the stress of not knowing where your money is going or whether you have enough to pay for something</li>
                            </ul>
                        </div>
                        
                        <p style="margin-top: 1rem;"><strong>Budgeting isn't just for rich people or math nerds. It's a basic life skill — and we're going to make it simple.</strong></p>
                    </div>
                    
                    <div class="module-section">
                        <h3>How to Create a Budget: Two Easy Methods</h3>
                        <p>There's no "perfect" way to budget. But here are two beginner-friendly methods that work for most people:</p>
                        
                        <div class="example-box">
                            <h4>Method 1: Zero-Based Budgeting (Every Dollar Has a Job)</h4>
                            <p>This method means your <strong>income – expenses = $0</strong>. You plan where every dollar goes — rent, groceries, debt, savings, even fun money — so nothing's unaccounted for.</p>
                            
                            <h5>Step-by-Step:</h5>
                            <ol>
                                <li><strong>List your total monthly income (after taxes)</strong><br>
                                Example: $1,400 from part-time job + $200 from side hustle = $1,600</li>
                                <li><strong>Write down all monthly expenses</strong><br>
                                Include fixed costs (like rent) and variable ones (like food). Be real — if you spend $80/month on snacks or streaming, write it down.</li>
                                <li><strong>Assign every dollar</strong><br>
                                Keep going until what's left is $0. That doesn't mean you're broke — it means every dollar is doing something worthwhile.</li>
                            </ol>
                            
                            <p><strong>Example:</strong></p>
                            <ul>
                                <li>Rent: $600</li>
                                <li>Food: $250</li>
                                <li>Phone: $50</li>
                                <li>Transportation: $80</li>
                                <li>Credit card: $100</li>
                                <li>Entertainment: $70</li>
                                <li>Savings: $150</li>
                                <li>Other: $300</li>
                                <li><strong>Total: $1,600 — budget balanced!</strong></li>
                            </ul>
                            
                            <p style="margin-top: 1rem;"><em>If something unexpected comes up, you adjust — but the point is to have a plan.</em></p>
                        </div>
                        
                        <div class="highlight-box">
                            <h4>Method 2: The 50/30/20 Rule</h4>
                            <p>If planning every dollar sounds stressful, don't worry. We've got another method for you. It's called the 50/30/20 rule, and it's as simple as it sounds. This method divides your income into three easy categories:</p>
                            
                            <ul>
                                <li><strong>50% Needs</strong> (must-haves): Rent, groceries, transportation, basic bills</li>
                                <li><strong>30% Wants</strong> (nice-to-haves): Eating out, clothes, fun stuff</li>
                                <li><strong>20% Savings or Debt Payoff</strong>: Emergency fund, loan payments, future goals</li>
                            </ul>
                            
                            <p><strong>Example (on $1,600/month):</strong></p>
                            <ul>
                                <li>50% = $800 for Needs</li>
                                <li>30% = $480 for Wants</li>
                                <li>20% = $320 for Savings or Debt</li>
                            </ul>
                            
                            <p style="margin-top: 1rem;"><em>If your needs go over 50%, that's okay — just adjust. This rule gives you a clear big-picture view of where your money should go.</em></p>
                        </div>
                        
                        <div class="quiz-container">
                            <h4>💡 Final Tip: Pick What Works for You</h4>
                            <p>You don't have to be perfect. The goal is progress, not perfection.</p>
                            <p>Whether you love detailed lists or just want rough percentages, the key is to start paying attention to your money. That's how you take control — even if you're starting small.</p>
                            <p style="margin-top: 1rem;"><em>"Budgeting isn't about limiting yourself. It's about making room for the things that matter." - Elizabeth Warren</em></p>
                        </div>
                    </div>
                `
            },
            {
                title: "Tracking Spending",
                content: `
                    <div class="module-section">
                        <h3>Where Did All My Money Go?</h3>
                        <p>Ever looked at your bank balance and thought, "How is it already this low?"</p>
                        <p>You might remember paying rent… maybe a few takeout meals… but not much else. That feeling? It's what happens when you don't track your spending.</p>
                        
                        <p><strong>Tracking your spending is about awareness — not guilt.</strong> You're not judging yourself. You're learning what your habits actually look like. And once you see the whole picture, you can make smarter decisions, even without changing your income. It's a journey of self-discovery, not a trial.</p>
                        
                        <div class="highlight-box">
                            <h4>Why Tracking Is a Game-Changer?</h4>
                            <p>Here's what happens when you track your spending:</p>
                            <ul>
                                <li>You notice spending leaks (like $7 coffee every day)</li>
                                <li>You catch hidden fees or double charges</li>
                                <li>You stop overspending without even trying</li>
                                <li>You feel more confident and in control</li>
                            </ul>
                            <p style="margin-top: 1rem;"><strong>Bottom line:</strong> If you don't know where your money is going, you can't make it work better for you.</p>
                        </div>
                        
                        <h4 style="margin-top: 2rem;">How to Start Tracking (Without Getting Overwhelmed)</h4>
                        
                        <div class="example-box">
                            <h4>Option 1: Write It Down (Old School, Still Works)</h4>
                            <p>Use a notebook or your phone's notes app. Every time you buy something, write:</p>
                            <ul>
                                <li>What you bought</li>
                                <li>How much</li>
                                <li>Why (need or want)</li>
                            </ul>
                            
                            <p><strong>Example:</strong></p>
                            <ul>
                                <li>"$5.50 – Coffee – Want"</li>
                                <li>"$80 – Bus pass – Need"</li>
                                <li>"$15 – Groceries – Need"</li>
                            </ul>
                            <p style="margin-top: 1rem;"><em>Do this for just 7 days and you'll start to see patterns.</em></p>
                        </div>
                        
                        <div class="highlight-box">
                            <h4>Option 2: Use a Simple App</h4>
                            <p>There are free budgeting apps made just for this, like:</p>
                            <ul>
                                <li><strong>Mint</strong></li>
                                <li><strong>EveryDollar</strong></li>
                                <li><strong>Spendee</strong></li>
                                <li><strong>PocketGuard</strong></li>
                            </ul>
                            <p style="margin-top: 1rem;">These connect to your bank account and automatically track your transactions. You can label expenses (like "food" or "transportation") and see where most of your money goes.</p>
                            <p><em>If you're worried about connecting a bank account, you can also enter transactions manually.</em></p>
                        </div>
                        
                        <div class="example-box">
                            <h4>Option 3: Use the Envelope Method</h4>
                            <p>This is tracking + budgeting in one. Take cash, divide it into labeled envelopes:</p>
                            <ul>
                                <li>Rent</li>
                                <li>Food</li>
                                <li>Transportation</li>
                                <li>Fun</li>
                            </ul>
                            <p style="margin-top: 1rem;">When the envelope is empty, you're done spending in that category for the month. It's simple, visual, and super effective — especially if you prefer using cash.</p>
                        </div>
                        
                        <div class="quiz-container">
                            <h4>📝 The "Spending Journal" Challenge</h4>
                            <p>Try this for one week:</p>
                            <ol>
                                <li>Write down everything you spend</li>
                                <li>Mark each item as a Need or Want</li>
                                <li>At the end of the week, total it up</li>
                            </ol>
                            
                            <p style="margin-top: 1rem;"><strong>Ask yourself:</strong></p>
                            <ul>
                                <li>What surprised you?</li>
                                <li>What could you cut back on without suffering?</li>
                                <li>What would you rather be putting money toward?</li>
                            </ul>
                        </div>
                        
                        <div class="highlight-box" style="margin-top: 2rem;">
                            <h4>Key Takeaway: Knowledge = Power</h4>
                            <p>You don't have to track forever. But doing it for even one month can change how you see your money — and yourself.</p>
                            <p style="margin-top: 1rem;">It's like turning on the lights in a dark room. Once you see what's happening, you'll never want to go back.</p>
                            <p style="margin-top: 1rem;"><em>"You can't improve what you don't measure." — Peter Drucker</em></p>
                        </div>
                    </div>
                `
            },
            {
                title: "Needs vs. Wants",
                content: `
                    <div class="module-section">
                        <h3>Why Does This Matter?</h3>
                        <p>If you've ever said "I needed that!" after buying something… you're not alone.</p>
                        <p>But was it a need, or just an extreme want?</p>
                        
                        <p>When money is tight, being honest about what's essential and what's optional can be the difference between:</p>
                        <ul>
                            <li>Paying rent on time ✅ vs. being short ❌</li>
                            <li>Having groceries for the week ✅ vs. living off instant noodles ❌</li>
                            <li>Saving for something big ✅ vs. wondering where your paycheck went ❌</li>
                        </ul>
                        
                        <p style="margin-top: 1rem;">Understanding needs vs. wants isn't about cutting out all joy. It's about making smarter choices so you can prioritize your life, your goals, and your peace of mind.</p>
                        
                        <div class="example-box">
                            <h4>What's a "Need"?</h4>
                            <p>Needs are the things you must pay for to survive and function:</p>
                            <ul>
                                <li>Housing (rent, utilities)</li>
                                <li>Basic food and water</li>
                                <li>Transportation (bus pass, gas, etc.)</li>
                                <li>Essential clothing (a warm jacket, work shoes)</li>
                                <li>Healthcare and medications</li>
                                <li>Minimum debt payments</li>
                                <li>Childcare (if you're a parent)</li>
                                <li>A phone (yes — if it's for work, school, or emergencies)</li>
                            </ul>
                            <p style="margin-top: 1rem;"><strong>If skipping it would put your health, safety, or job at risk — it's a need.</strong></p>
                        </div>
                        
                        <div class="highlight-box">
                            <h4>What's a "Want"?</h4>
                            <p>Wants are things that make life more fun or comfortable — but aren't essential:</p>
                            <ul>
                                <li>Takeout or fast food (vs. cooking at home)</li>
                                <li>Streaming services (Netflix, Spotify, etc.)</li>
                                <li>New clothes (when you already have enough)</li>
                                <li>Designer brands or trendy tech</li>
                                <li>Uber when the bus is available</li>
                                <li>Daily coffee runs</li>
                                <li>Phone upgrades every year</li>
                            </ul>
                            <p style="margin-top: 1rem;"><strong>Wants aren't bad!</strong> But when you're trying to budget, save, or pay off debt, cutting back on wants is usually where you find the wiggle room.</p>
                        </div>
                        
                        <div class="example-box">
                            <h4>Real Life: Gray Areas Exist</h4>
                            <p>Sometimes, it's hard to tell. Is a phone plan a need or a want? <strong>Depends on the plan.</strong></p>
                            <p>Is the internet a need? For most people today, yes, especially for school, job applications, or remote work.</p>
                            <p style="margin-top: 1rem;"><em>It's not always black and white. That's okay. The goal is to become more aware, not perfect.</em></p>
                        </div>
                        
                        <div class="quiz-container">
                            <h4>🎯 Try This: The "Needs vs. Wants" Sorting Game</h4>
                            <p>Write down your top 10 monthly expenses (or check your bank app). Next to each one, label it:</p>
                            <ul>
                                <li>✅ Need (Must have to live/function)</li>
                                <li>❗ Want (Nice to have, not essential)</li>
                            </ul>
                            
                            <p style="margin-top: 1rem;"><strong>Then ask:</strong></p>
                            <ul>
                                <li>Which "wants" could I reduce without sacrificing my happiness?</li>
                                <li>Could I replace any "wants" with cheaper alternatives?</li>
                            </ul>
                        </div>
                        
                        <div class="highlight-box" style="margin-top: 2rem;">
                            <h4>Mindset Shift: Needs First, Then Wants</h4>
                            <p>When you start planning your monthly budget, cover your needs first.</p>
                            <p>Whatever's left over can go toward wants or savings — based on what matters most to you.</p>
                            <p style="margin-top: 1rem;">This is how people with limited incomes still build security — by prioritizing what truly matters.</p>
                            <p style="margin-top: 1rem;"><em>"You can have anything you want — but not everything at once." — Unknown</em></p>
                        </div>
                    </div>
                `
            },
            {
                title: "Emergency Funds",
                content: `
                    <div class="module-section">
                        <h3>Emergency Funds — Your Financial Safety Net</h3>
                        
                        <h4>What's an Emergency Fund?</h4>
                        <p>An emergency fund is money you set aside for unexpected problems — like:</p>
                        <ul>
                            <li>Car repairs</li>
                            <li>Medical bills</li>
                            <li>Job loss</li>
                            <li>Last-minute travel</li>
                            <li>Broken phone (if it's essential)</li>
                        </ul>
                        <p style="margin-top: 1rem;"><strong>This isn't money for vacations or sales — it's your "just in case" cash.</strong></p>
                        
                        <div class="highlight-box">
                            <h4>Why is it So Important?</h4>
                            <p>Life happens. And when it does, an emergency fund means:</p>
                            <ul>
                                <li>You don't have to use a credit card (and fall into debt)</li>
                                <li>You don't need to borrow from friends or family</li>
                                <li>You can breathe easier during a tough time</li>
                            </ul>
                            <p style="margin-top: 1rem;"><strong>Even $300–$500 can make a huge difference in an emergency.</strong></p>
                        </div>
                        
                        <div class="example-box">
                            <h4>How to Start One (Even on a Tight Budget)</h4>
                            <ul>
                                <li><strong>Start small:</strong> $5 or $10 a week adds up</li>
                                <li><strong>Use a separate savings account</strong> so you're not tempted to spend it</li>
                                <li><strong>Treat it like a bill</strong> you owe yourself — pay it every month</li>
                            </ul>
                            
                            <p style="margin-top: 1rem;">If you already live paycheck to paycheck, this might feel impossible — but even saving coins or rounding up purchases can help build the habit.</p>
                            
                            <h5 style="margin-top: 1.5rem;">Goal:</h5>
                            <ul>
                                <li><strong>Short-Term:</strong> Save $500</li>
                                <li><strong>Long-Term:</strong> Build up 1–3 months of expenses</li>
                            </ul>
                            
                            <p style="margin-top: 1rem;"><em>You don't have to get there overnight. Just start.</em></p>
                        </div>
                        
                        <div class="highlight-box" style="margin-top: 2rem;">
                            <h4>💡 Key Takeaway</h4>
                            <p><strong>Emergency funds turn a crisis into an inconvenience.</strong></p>
                        </div>
                    </div>
                `
            },
            {
                title: "Budgeting Tools",
                content: `
                    <div class="module-section">
                        <h3>Tools — Budgeting Apps & Spreadsheets</h3>
                        
                        <h4>Why Use Budgeting Tools?</h4>
                        <p>You don't have to budget in your head — that's how things slip through the cracks.</p>
                        <p>Using tools like apps or spreadsheets can make budgeting:</p>
                        <ul>
                            <li>Faster 🕒</li>
                            <li>More accurate 📊</li>
                            <li>Less stressful 😌</li>
                            <li>And actually kind of fun 🎯</li>
                        </ul>
                        
                        <p style="margin-top: 1rem;"><strong>Pick whatever works best for you. Paper, phone app, Google Sheet — the best tool is the one you'll actually use.</strong></p>
                        
                        <div class="example-box">
                            <h4>📱 Best Free Budgeting Apps (Beginner-Friendly)</h4>
                            
                            <h5>🔹 1. Mint</h5>
                            <ul>
                                <li>Connects to your bank account</li>
                                <li>Tracks your spending automatically</li>
                                <li>Sends alerts when bills are due</li>
                                <li>Shows your budget breakdown by category</li>
                            </ul>
                            
                            <h5>🔹 2. EveryDollar (Free Version)</h5>
                            <ul>
                                <li>Based on the zero-based budgeting method</li>
                                <li>Easy drag-and-drop interface</li>
                                <li>No need to connect to the bank if you don't want to</li>
                            </ul>
                            
                            <h5>🔹 3. PocketGuard</h5>
                            <ul>
                                <li>Helps you see how much is "safe to spend"</li>
                                <li>Flags subscriptions and hidden fees</li>
                                <li>Simple setup and clean design</li>
                            </ul>
                            
                            <p style="margin-top: 1rem;"><strong>💡 Don't want to link your bank? All of these let you add info manually, too.</strong></p>
                        </div>
                        
                        <div class="highlight-box">
                            <h4>📊 Using a Spreadsheet (Google Sheets or Excel)</h4>
                            <p>If you like more control (or want to avoid apps), spreadsheets are great.</p>
                            <p>You can:</p>
                            <ul>
                                <li>List income and expenses</li>
                                <li>Use simple formulas to track totals</li>
                                <li>Copy/paste monthly to track progress over time</li>
                            </ul>
                            
                            <p style="margin-top: 1rem;"><strong>💡 Pro tip:</strong> We'll include a free downloadable FinQuest Budget Template you can use or edit in Google Sheets.</p>
                        </div>
                        
                        <div class="quiz-container">
                            <h4>✅ Final Thoughts</h4>
                            <p>It doesn't matter whether you use an app, a spreadsheet, or a notebook. What matters is sticking with it and checking in with your budget regularly — even just once a week.</p>
                            <p style="margin-top: 1rem;"><em>"A budget is telling your money where to go, instead of wondering where it went." — Dave Ramsey</em></p>
                        </div>
                    </div>
                `
            },
            {
                title: "Module 2 Quiz",
                content: `
                    <div class="quiz-container">
                        <h3>Module 2 Quiz: Budgeting and Money Management</h3>
                        
                        <h4 style="margin-top: 2rem; color: var(--primary-color);">Part A: Multiple Choice (5 questions)</h4>
                        
                        <div class="quiz-question" style="margin-top: 1.5rem;">
                            <strong>Question 1:</strong> What is the main purpose of a budget?
                        </div>
                        <div class="quiz-options">
                            <div class="quiz-option">
                                <input type="radio" name="q1" value="A" id="q1a">
                                <label for="q1a">A. To track your credit score</label>
                            </div>
                            <div class="quiz-option">
                                <input type="radio" name="q1" value="B" id="q1b">
                                <label for="q1b">B. To make sure you never spend money</label>
                            </div>
                            <div class="quiz-option">
                                <input type="radio" name="q1" value="C" id="q1c">
                                <label for="q1c">C. To plan where your money goes each month</label>
                            </div>
                            <div class="quiz-option">
                                <input type="radio" name="q1" value="D" id="q1d">
                                <label for="q1d">D. To increase your taxes</label>
                            </div>
                        </div>
                        
                        <div class="quiz-question">
                            <strong>Question 2:</strong> Which of the following is a common budgeting method?
                        </div>
                        <div class="quiz-options">
                            <div class="quiz-option">
                                <input type="radio" name="q2" value="A" id="q2a">
                                <label for="q2a">A. The 100/0 rule</label>
                            </div>
                            <div class="quiz-option">
                                <input type="radio" name="q2" value="B" id="q2b">
                                <label for="q2b">B. The 50/30/20 rule</label>
                            </div>
                            <div class="quiz-option">
                                <input type="radio" name="q2" value="C" id="q2c">
                                <label for="q2c">C. The paycheck gamble method</label>
                            </div>
                            <div class="quiz-option">
                                <input type="radio" name="q2" value="D" id="q2d">
                                <label for="q2d">D. The credit-over-cash rule</label>
                            </div>
                        </div>
                        
                        <div class="quiz-question">
                            <strong>Question 3:</strong> In zero-based budgeting, what should your income minus expenses equal?
                        </div>
                        <div class="quiz-options">
                            <div class="quiz-option">
                                <input type="radio" name="q3" value="A" id="q3a">
                                <label for="q3a">A. $100</label>
                            </div>
                            <div class="quiz-option">
                                <input type="radio" name="q3" value="B" id="q3b">
                                <label for="q3b">B. $50</label>
                            </div>
                            <div class="quiz-option">
                                <input type="radio" name="q3" value="C" id="q3c">
                                <label for="q3c">C. Your monthly savings goal</label>
                            </div>
                            <div class="quiz-option">
                                <input type="radio" name="q3" value="D" id="q3d">
                                <label for="q3d">D. $0</label>
                            </div>
                        </div>
                        
                        <div class="quiz-question">
                            <strong>Question 4:</strong> What category would "Netflix" or "eating out" usually fall under?
                        </div>
                        <div class="quiz-options">
                            <div class="quiz-option">
                                <input type="radio" name="q4" value="A" id="q4a">
                                <label for="q4a">A. Needs</label>
                            </div>
                            <div class="quiz-option">
                                <input type="radio" name="q4" value="B" id="q4b">
                                <label for="q4b">B. Emergency fund</label>
                            </div>
                            <div class="quiz-option">
                                <input type="radio" name="q4" value="C" id="q4c">
                                <label for="q4c">C. Wants</label>
                            </div>
                            <div class="quiz-option">
                                <input type="radio" name="q4" value="D" id="q4d">
                                <label for="q4d">D. Utilities</label>
                            </div>
                        </div>
                        
                        <div class="quiz-question">
                            <strong>Question 5:</strong> What is one reason people fail to stick to a budget?
                        </div>
                        <div class="quiz-options">
                            <div class="quiz-option">
                                <input type="radio" name="q5" value="A" id="q5a">
                                <label for="q5a">A. They earn too much money</label>
                            </div>
                            <div class="quiz-option">
                                <input type="radio" name="q5" value="B" id="q5b">
                                <label for="q5b">B. They track every cent they spend</label>
                            </div>
                            <div class="quiz-option">
                                <input type="radio" name="q5" value="C" id="q5c">
                                <label for="q5c">C. They don't review or update their budget</label>
                            </div>
                            <div class="quiz-option">
                                <input type="radio" name="q5" value="D" id="q5d">
                                <label for="q5d">D. They use spreadsheets</label>
                            </div>
                        </div>
                        
                        <h4 style="margin-top: 2rem; color: var(--primary-color);">Part B: True or False (5 questions)</h4>
                        
                        <div class="quiz-question" style="margin-top: 1.5rem;">
                            <strong>Question 6:</strong> A budget is only useful if you earn over $40,000 a year.
                        </div>
                        <div class="quiz-options">
                            <div class="quiz-option">
                                <input type="radio" name="q6" value="True" id="q6t">
                                <label for="q6t">True</label>
                            </div>
                            <div class="quiz-option">
                                <input type="radio" name="q6" value="False" id="q6f">
                                <label for="q6f">False</label>
                            </div>
                        </div>
                        
                        <div class="quiz-question">
                            <strong>Question 7:</strong> Needs are things like rent, food, and transportation.
                        </div>
                        <div class="quiz-options">
                            <div class="quiz-option">
                                <input type="radio" name="q7" value="True" id="q7t">
                                <label for="q7t">True</label>
                            </div>
                            <div class="quiz-option">
                                <input type="radio" name="q7" value="False" id="q7f">
                                <label for="q7f">False</label>
                            </div>
                        </div>
                        
                        <div class="quiz-question">
                            <strong>Question 8:</strong> Wants should always be avoided completely.
                        </div>
                        <div class="quiz-options">
                            <div class="quiz-option">
                                <input type="radio" name="q8" value="True" id="q8t">
                                <label for="q8t">True</label>
                            </div>
                            <div class="quiz-option">
                                <input type="radio" name="q8" value="False" id="q8f">
                                <label for="q8f">False</label>
                            </div>
                        </div>
                        
                        <div class="quiz-question">
                            <strong>Question 9:</strong> Tracking your spending helps you stay on budget.
                        </div>
                        <div class="quiz-options">
                            <div class="quiz-option">
                                <input type="radio" name="q9" value="True" id="q9t">
                                <label for="q9t">True</label>
                            </div>
                            <div class="quiz-option">
                                <input type="radio" name="q9" value="False" id="q9f">
                                <label for="q9f">False</label>
                            </div>
                        </div>
                        
                        <div class="quiz-question">
                            <strong>Question 10:</strong> Saving should be part of your budget even if the amount is small.
                        </div>
                        <div class="quiz-options">
                            <div class="quiz-option">
                                <input type="radio" name="q10" value="True" id="q10t">
                                <label for="q10t">True</label>
                            </div>
                            <div class="quiz-option">
                                <input type="radio" name="q10" value="False" id="q10f">
                                <label for="q10f">False</label>
                            </div>
                        </div>
                        
                        <button class="btn btn-primary" onclick="checkQuiz(2)" style="margin-top: 2rem;">Check Answers</button>
                        <div id="quiz-results-2"></div>
                    </div>
                `
            }
        ]
    },
    3: {
        title: "Saving Strategies",
        sections: [
            {
                title: "Introduction & Why Saving Matters",
                content: `
                    <div class="module-section">
                        <h3>📅 Introduction</h3>
                        <p>Saving isn't just for rich people. It's how anyone builds peace of mind. When you have even a small amount set aside, unexpected costs (like a broken phone or car trouble) don't feel like emergencies. This module explains why saving matters, how to get started, and ways to make it automatic and manageable — even on a tight budget.</p>
                        
                        <h3 style="margin-top: 2rem;">🏦 Why Saving Matters</h3>
                        <p>When you save, you're paying yourself first. That means:</p>
                        <ul>
                            <li>Fewer money emergencies</li>
                            <li>Less stress around bills</li>
                            <li>More control over your choices</li>
                            <li>A path toward bigger goals (apartment, education, business)</li>
                            </ul>
                        
                        <div class="highlight-box">
                            <h4>Remember</h4>
                            <p><strong>Even $5/week is a big win. It's about starting small and being consistent.</strong></p>
                            <p style="margin-top: 1rem;"><em>"Saving doesn't require being rich. It requires being intentional."</em></p>
                        </div>
                    </div>
                `
            },
            {
                title: "Types of Savings Accounts",
                content: `
                    <div class="module-section">
                        <h3>💰 Types of Savings Accounts</h3>
                        <p>Not all savings accounts are the same. Here are the basics:</p>
                        
                        <div class="example-box">
                            <h4>1. Regular Savings Account</h4>
                            <ul>
                                <li>Found at most banks and credit unions</li>
                                <li>Safe, insured, but earns low interest</li>
                            </ul>
                        </div>
                        
                        <div class="highlight-box">
                            <h4>2. High-Yield Savings Account (HYSA)</h4>
                            <ul>
                                <li>Usually offered by online banks</li>
                                <li>Pays much more interest (up to 5x more than regular)</li>
                                <li>Great for emergency funds or goal-based saving</li>
                            </ul>
                        </div>
                        
                        <div class="example-box">
                            <h4>3. Certificates of Deposit (CDs)</h4>
                            <ul>
                                <li>Lock your money away for a fixed time (6 months, 1 year, etc.)</li>
                                <li>Higher interest, but penalties for early withdrawal</li>
                            </ul>
                        </div>
                        
                        <div class="highlight-box">
                            <h4>4. Cash Management Accounts</h4>
                            <ul>
                                <li>Offered by fintechs like SoFi or Wealthfront</li>
                                <li>Combines checking and savings features</li>
                                <li>Often includes high interest + mobile features</li>
                            </ul>
                        </div>
                    </div>
                `
            },
            {
                title: "High-Yield vs. Regular Savings",
                content: `
                    <div class="module-section">
                        <h3>📈 High-Yield vs. Regular Savings</h3>
                        
                        <div class="example-box">
                            <h4>Comparison Table</h4>
                            <table style="width: 100%; border-collapse: collapse; margin-top: 1rem;">
                                <thead>
                                    <tr style="background: var(--bg-secondary);">
                                        <th style="padding: 0.75rem; text-align: left; border: 1px solid var(--border-color);">Feature</th>
                                        <th style="padding: 0.75rem; text-align: left; border: 1px solid var(--border-color);">Regular Savings</th>
                                        <th style="padding: 0.75rem; text-align: left; border: 1px solid var(--border-color);">High-Yield Savings</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td style="padding: 0.75rem; border: 1px solid var(--border-color);"><strong>Interest Rate</strong></td>
                                        <td style="padding: 0.75rem; border: 1px solid var(--border-color);">~0.01%</td>
                                        <td style="padding: 0.75rem; border: 1px solid var(--border-color);">4–5%</td>
                                    </tr>
                                    <tr style="background: var(--bg-secondary);">
                                        <td style="padding: 0.75rem; border: 1px solid var(--border-color);"><strong>Access</strong></td>
                                        <td style="padding: 0.75rem; border: 1px solid var(--border-color);">In-branch</td>
                                        <td style="padding: 0.75rem; border: 1px solid var(--border-color);">Online or app-based</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 0.75rem; border: 1px solid var(--border-color);"><strong>Best For</strong></td>
                                        <td style="padding: 0.75rem; border: 1px solid var(--border-color);">Getting started</td>
                                        <td style="padding: 0.75rem; border: 1px solid var(--border-color);">Growing savings</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        
                        <div class="highlight-box" style="margin-top: 2rem;">
                            <h4>💡 Key Takeaway</h4>
                            <p>Even if you can't deposit much, a HYSA helps your money grow faster with no extra effort.</p>
                        </div>
                    </div>
                `
            },
            {
                title: "Automating Savings",
                content: `
                    <div class="module-section">
                        <h3>🤖 Automating Savings</h3>
                        <p>Saving is more effortless when you don't have to think about it.</p>
                        
                        <div class="highlight-box">
                            <h4>How to automate it:</h4>
                            <ul>
                                <li>Set up auto-transfers from checking to savings on payday</li>
                                <li>Use apps like Digit, Chime, or Acorns to round up purchases and save the difference</li>
                            </ul>
                        </div>
                        
                        <div class="example-box">
                            <h4>Example:</h4>
                            <p>If your paycheck hits on Friday, set $10 to transfer to savings on that day. Done.</p>
                        </div>
                        
                        <div class="highlight-box" style="margin-top: 2rem;">
                            <h4>💡 Remember</h4>
                            <p><em>"If you don't see it, you won't miss it."</em></p>
                        </div>
                    </div>
                `
            },
            {
                title: "Savings Challenges & Summary",
                content: `
                    <div class="module-section">
                        <h3>🏋️ Savings Challenges (Make It Fun)</h3>
                        <p>Trying to jump-start your savings? Turn it into a challenge:</p>
                        
                        <div class="example-box">
                            <h4>• $5/Day Challenge</h4>
                            <p>Save $5/day for 30 days = <strong>$150</strong></p>
                        </div>
                        
                        <div class="highlight-box">
                            <h4>• 52-Week Challenge</h4>
                            <p>Start with $1 in Week 1, $2 in Week 2... Ends with <strong>$1,378 saved in a year</strong></p>
                        </div>
                        
                        <div class="example-box">
                            <h4>• No-Spend Weekend</h4>
                            <p>One weekend a month, spend $0 (except essentials) and save what you would've spent</p>
                        </div>
                        
                        <div class="quiz-container" style="margin-top: 2rem;">
                            <h4>💡 Remember</h4>
                            <p>These tricks can help form habits while keeping it interesting.</p>
                        </div>
                    </div>
                    
                    <div class="module-section">
                        <h3>🔹 Summary</h3>
                        <p>Saving isn't about sacrifice — it's about security and choice. Even a few dollars can grow over time. The key is to start early, save consistently, and use the tools that work best for you.</p>
                        
                        <div class="highlight-box" style="margin-top: 2rem;">
                            <h4>Final Thought</h4>
                            <p><em>"Money saved is freedom earned."</em></p>
                        </div>
                    </div>
                `
            },
            {
                title: "Module 3 Quiz",
                content: `
                    <div class="quiz-container">
                        <h3>📄 Module 3 Quiz: Saving Strategies</h3>
                        
                        <h4 style="margin-top: 2rem; color: var(--primary-color);">Multiple Choice (5 questions)</h4>
                        
                        <div class="quiz-question" style="margin-top: 1.5rem;">
                            <strong>Question 1:</strong> What is the main reason to build savings?
                        </div>
                        <div class="quiz-options">
                            <div class="quiz-option">
                                <input type="radio" name="q1" value="A" id="q1a">
                                <label for="q1a">A. To buy clothes</label>
                            </div>
                            <div class="quiz-option">
                                <input type="radio" name="q1" value="B" id="q1b">
                                <label for="q1b">B. To cover unexpected expenses</label>
                            </div>
                            <div class="quiz-option">
                                <input type="radio" name="q1" value="C" id="q1c">
                                <label for="q1c">C. To avoid working</label>
                            </div>
                            <div class="quiz-option">
                                <input type="radio" name="q1" value="D" id="q1d">
                                <label for="q1d">D. To qualify for loans</label>
                            </div>
                        </div>
                        
                        <div class="quiz-question">
                            <strong>Question 2:</strong> What kind of savings account usually pays the most interest?
                        </div>
                        <div class="quiz-options">
                            <div class="quiz-option">
                                <input type="radio" name="q2" value="A" id="q2a">
                                <label for="q2a">A. Checking</label>
                            </div>
                            <div class="quiz-option">
                                <input type="radio" name="q2" value="B" id="q2b">
                                <label for="q2b">B. CD</label>
                            </div>
                            <div class="quiz-option">
                                <input type="radio" name="q2" value="C" id="q2c">
                                <label for="q2c">C. Regular savings</label>
                            </div>
                            <div class="quiz-option">
                                <input type="radio" name="q2" value="D" id="q2d">
                                <label for="q2d">D. High-yield savings</label>
                            </div>
                        </div>
                        
                        <div class="quiz-question">
                            <strong>Question 3:</strong> Which of these helps automate savings?
                        </div>
                        <div class="quiz-options">
                            <div class="quiz-option">
                                <input type="radio" name="q3" value="A" id="q3a">
                                <label for="q3a">A. Using cash only</label>
                            </div>
                            <div class="quiz-option">
                                <input type="radio" name="q3" value="B" id="q3b">
                                <label for="q3b">B. Auto-transfers</label>
                            </div>
                            <div class="quiz-option">
                                <input type="radio" name="q3" value="C" id="q3c">
                                <label for="q3c">C. Writing checks</label>
                            </div>
                            <div class="quiz-option">
                                <input type="radio" name="q3" value="D" id="q3d">
                                <label for="q3d">D. Getting a loan</label>
                            </div>
                        </div>
                        
                        <div class="quiz-question">
                            <strong>Question 4:</strong> In the $5/day savings challenge, how much do you save in one month?
                        </div>
                        <div class="quiz-options">
                            <div class="quiz-option">
                                <input type="radio" name="q4" value="A" id="q4a">
                                <label for="q4a">A. $30</label>
                            </div>
                            <div class="quiz-option">
                                <input type="radio" name="q4" value="B" id="q4b">
                                <label for="q4b">B. $75</label>
                            </div>
                            <div class="quiz-option">
                                <input type="radio" name="q4" value="C" id="q4c">
                                <label for="q4c">C. $150</label>
                            </div>
                            <div class="quiz-option">
                                <input type="radio" name="q4" value="D" id="q4d">
                                <label for="q4d">D. $300</label>
                            </div>
                        </div>
                        
                        <div class="quiz-question">
                            <strong>Question 5:</strong> What's a downside of CDs?
                        </div>
                        <div class="quiz-options">
                            <div class="quiz-option">
                                <input type="radio" name="q5" value="A" id="q5a">
                                <label for="q5a">A. No interest</label>
                            </div>
                            <div class="quiz-option">
                                <input type="radio" name="q5" value="B" id="q5b">
                                <label for="q5b">B. Penalties for early withdrawal</label>
                            </div>
                            <div class="quiz-option">
                                <input type="radio" name="q5" value="C" id="q5c">
                                <label for="q5c">C. Online only</label>
                            </div>
                            <div class="quiz-option">
                                <input type="radio" name="q5" value="D" id="q5d">
                                <label for="q5d">D. No account number</label>
                            </div>
                        </div>
                        
                        <h4 style="margin-top: 2rem; color: var(--primary-color);">True or False (5 questions)</h4>
                        
                        <div class="quiz-question" style="margin-top: 1.5rem;">
                            <strong>Question 6:</strong> You need a lot of money to start saving.
                        </div>
                        <div class="quiz-options">
                            <div class="quiz-option">
                                <input type="radio" name="q6" value="True" id="q6t">
                                <label for="q6t">True</label>
                            </div>
                            <div class="quiz-option">
                                <input type="radio" name="q6" value="False" id="q6f">
                                <label for="q6f">False</label>
                            </div>
                        </div>
                        
                        <div class="quiz-question">
                            <strong>Question 7:</strong> High-yield savings accounts are often online.
                        </div>
                        <div class="quiz-options">
                            <div class="quiz-option">
                                <input type="radio" name="q7" value="True" id="q7t">
                                <label for="q7t">True</label>
                            </div>
                            <div class="quiz-option">
                                <input type="radio" name="q7" value="False" id="q7f">
                                <label for="q7f">False</label>
                            </div>
                        </div>
                        
                        <div class="quiz-question">
                            <strong>Question 8:</strong> You should always withdraw money from CDs early.
                        </div>
                        <div class="quiz-options">
                            <div class="quiz-option">
                                <input type="radio" name="q8" value="True" id="q8t">
                                <label for="q8t">True</label>
                            </div>
                            <div class="quiz-option">
                                <input type="radio" name="q8" value="False" id="q8f">
                                <label for="q8f">False</label>
                            </div>
                        </div>
                        
                        <div class="quiz-question">
                            <strong>Question 9:</strong> Automating savings helps you build habits.
                        </div>
                        <div class="quiz-options">
                            <div class="quiz-option">
                                <input type="radio" name="q9" value="True" id="q9t">
                                <label for="q9t">True</label>
                            </div>
                            <div class="quiz-option">
                                <input type="radio" name="q9" value="False" id="q9f">
                                <label for="q9f">False</label>
                            </div>
                        </div>
                        
                        <div class="quiz-question">
                            <strong>Question 10:</strong> A no-spend weekend can boost your savings.
                        </div>
                        <div class="quiz-options">
                            <div class="quiz-option">
                                <input type="radio" name="q10" value="True" id="q10t">
                                <label for="q10t">True</label>
                            </div>
                            <div class="quiz-option">
                                <input type="radio" name="q10" value="False" id="q10f">
                                <label for="q10f">False</label>
                            </div>
                        </div>
                        
                        <button class="btn btn-primary" onclick="checkQuiz(3)" style="margin-top: 2rem;">Check Answers</button>
                        <div id="quiz-results-3"></div>
                    </div>
                `
            }
        ]
    },
    4: {
        title: "Banking Basics",
        sections: [
            {
                title: "Introduction & How to Choose a Bank or Credit Union",
                content: `
                    <div class="module-section">
                        <h3>📅 Introduction</h3>
                        <p>Banks are everywhere, but many people don't fully understand how to use them. The right bank can help you grow savings, manage money, and avoid fees. The wrong one can cost you. This module will break down how banks work, what accounts to open, how to avoid common traps, and the tools that make banking easier.</p>
                        
                        <h3 style="margin-top: 2rem;">🏦 How to Choose a Bank or Credit Union</h3>
                        <p>Here's what to look for in a bank (or credit union):</p>
                        <ul>
                            <li>No monthly fees or minimums</li>
                            <li>FDIC/NCUA insurance (protects up to $250,000)</li>
                            <li>Mobile app and online tools</li>
                            <li>Free ATM access or fee reimbursements</li>
                            <li>Customer service that's responsive and helpful</li>
                            </ul>
                        
                        <div class="highlight-box" style="margin-top: 2rem;">
                            <h4>Banks vs. Credit Unions:</h4>
                            <ul>
                                <li><strong>Banks</strong> are for-profit companies</li>
                                <li><strong>Credit unions</strong> are nonprofit, member-owned, and often have better rates and lower fees</li>
                            </ul>
                            <p style="margin-top: 1rem;">If you're just starting, a credit union or online bank can be a great fit.</p>
                        </div>
                    </div>
                `
            },
            {
                title: "Checking vs. Savings Accounts",
                content: `
                    <div class="module-section">
                        <h3>🔍 Checking vs. Savings Accounts</h3>
                        <p>These are your two main account types:</p>
                        
                        <div class="example-box">
                            <h4>• Checking Account:</h4>
                            <ul>
                                <li>Where your paycheck goes</li>
                                <li>Used for spending and paying bills</li>
                                <li>Linked to your debit card</li>
                        </ul>
                        </div>
                        
                        <div class="highlight-box">
                            <h4>• Savings Account:</h4>
                            <ul>
                                <li>Used for saving money (short- or long-term)</li>
                                <li>Earns interest</li>
                                <li>Helps separate spending from saving</li>
                            </ul>
                        </div>
                        
                        <div class="quiz-container" style="margin-top: 2rem;">
                            <h4>💡 Pro Tip</h4>
                            <p>Have both. Use checking for spending and savings for goals or emergencies.</p>
                        </div>
                    </div>
                `
            },
            {
                title: "Overdrafts, Fees & Mobile Banking",
                content: `
                    <div class="module-section">
                        <h3>⚠️ Overdrafts, Fees & How to Avoid Them</h3>
                        <p>Banks love charging fees. You don't need to pay them.</p>
                        
                        <h4 style="margin-top: 1.5rem;">Common fees include:</h4>
                        <ul>
                            <li><strong>Overdraft Fees:</strong> Spending more than you have = $30+ fee</li>
                            <li><strong>ATM Fees:</strong> Using a machine outside your bank's network</li>
                            <li><strong>Monthly Maintenance Fees:</strong> Just for having an account</li>
                            </ul>
                        
                        <div class="highlight-box" style="margin-top: 2rem;">
                            <h4>How to avoid them:</h4>
                            <ul>
                                <li>Choose a bank with no-fee options</li>
                                <li>Set up low balance alerts</li>
                                <li>Link a savings account for overdraft protection</li>
                                <li>Always know your balance</li>
                            </ul>
                        </div>
                        </div>
                        
                    <div class="module-section">
                        <h3 style="margin-top: 2rem;">📱 Mobile Banking Tools</h3>
                        <p>Most banks now offer mobile apps that let you:</p>
                        <ul>
                            <li>Check balances anytime</li>
                            <li>Transfer money between accounts</li>
                            <li>Deposit checks with your phone</li>
                            <li>Set up bill reminders and alerts</li>
                        </ul>
                        
                        <div class="example-box" style="margin-top: 2rem;">
                            <h4>Popular mobile-first banks:</h4>
                            <p>Chime, Varo, SoFi, and Ally</p>
                        </div>
                        
                        <div class="highlight-box" style="margin-top: 2rem;">
                            <h4>💡 Remember</h4>
                            <p><em>"A good banking app puts your finances in your pocket."</em></p>
                        </div>
                    </div>
                    
                    <div class="module-section">
                        <h3>🔹 Summary</h3>
                        <p>Banking shouldn't be confusing or expensive. With the proper accounts and a little knowledge, you can manage money confidently, avoid fees, and grow your savings. Choose a bank that works for you, not against you.</p>
                        
                        <div class="highlight-box" style="margin-top: 2rem;">
                            <h4>Final Thought</h4>
                            <p><em>"Your money deserves a safe, smart home."</em></p>
                        </div>
                    </div>
                `
            },
            {
                title: "Module 4 Quiz",
                content: `
                        <div class="quiz-container">
                        <h3>📄 Module 4 Quiz: Banking Basics</h3>
                        
                        <h4 style="margin-top: 2rem; color: var(--primary-color);">Multiple Choice (5 questions)</h4>
                        
                        <div class="quiz-question" style="margin-top: 1.5rem;">
                            <strong>Question 1:</strong> What is the primary use of a checking account?
                        </div>
                        <div class="quiz-options">
                            <div class="quiz-option">
                                <input type="radio" name="q1" value="A" id="q1a">
                                <label for="q1a">A. Earning interest</label>
                            </div>
                            <div class="quiz-option">
                                <input type="radio" name="q1" value="B" id="q1b">
                                <label for="q1b">B. Storing money long-term</label>
                            </div>
                            <div class="quiz-option">
                                <input type="radio" name="q1" value="C" id="q1c">
                                <label for="q1c">C. Daily spending and bill payments</label>
                            </div>
                            <div class="quiz-option">
                                <input type="radio" name="q1" value="D" id="q1d">
                                <label for="q1d">D. Applying for loans</label>
                            </div>
                        </div>
                        
                        <div class="quiz-question">
                            <strong>Question 2:</strong> Which of the following is NOT a standard bank fee?
                        </div>
                        <div class="quiz-options">
                            <div class="quiz-option">
                                <input type="radio" name="q2" value="A" id="q2a">
                                <label for="q2a">A. Overdraft fee</label>
                            </div>
                            <div class="quiz-option">
                                <input type="radio" name="q2" value="B" id="q2b">
                                <label for="q2b">B. ATM fee</label>
                            </div>
                            <div class="quiz-option">
                                <input type="radio" name="q2" value="C" id="q2c">
                                <label for="q2c">C. Grocery fee</label>
                            </div>
                            <div class="quiz-option">
                                <input type="radio" name="q2" value="D" id="q2d">
                                <label for="q2d">D. Monthly maintenance fee</label>
                            </div>
                        </div>
                        
                        <div class="quiz-question">
                            <strong>Question 3:</strong> What does FDIC or NCUA insurance do?
                        </div>
                        <div class="quiz-options">
                            <div class="quiz-option">
                                <input type="radio" name="q3" value="A" id="q3a">
                                <label for="q3a">A. Protects your credit score</label>
                            </div>
                            <div class="quiz-option">
                                <input type="radio" name="q3" value="B" id="q3b">
                                <label for="q3b">B. Tracks your purchases</label>
                            </div>
                            <div class="quiz-option">
                                <input type="radio" name="q3" value="C" id="q3c">
                                <label for="q3c">C. Insures your deposits up to $250,000</label>
                            </div>
                            <div class="quiz-option">
                                <input type="radio" name="q3" value="D" id="q3d">
                                <label for="q3d">D. Gives you rewards</label>
                            </div>
                        </div>
                        
                        <div class="quiz-question">
                            <strong>Question 4:</strong> Which account should you use for building emergency savings?
                        </div>
                        <div class="quiz-options">
                            <div class="quiz-option">
                                <input type="radio" name="q4" value="A" id="q4a">
                                <label for="q4a">A. Checking</label>
                            </div>
                            <div class="quiz-option">
                                <input type="radio" name="q4" value="B" id="q4b">
                                <label for="q4b">B. Credit card</label>
                            </div>
                            <div class="quiz-option">
                                <input type="radio" name="q4" value="C" id="q4c">
                                <label for="q4c">C. Savings</label>
                            </div>
                            <div class="quiz-option">
                                <input type="radio" name="q4" value="D" id="q4d">
                                <label for="q4d">D. PayPal</label>
                            </div>
                        </div>
                        
                        <div class="quiz-question">
                            <strong>Question 5:</strong> What is a good way to avoid overdraft fees?
                        </div>
                        <div class="quiz-options">
                            <div class="quiz-option">
                                <input type="radio" name="q5" value="A" id="q5a">
                                <label for="q5a">A. Use only credit cards</label>
                            </div>
                            <div class="quiz-option">
                                <input type="radio" name="q5" value="B" id="q5b">
                                <label for="q5b">B. Spend without checking your balance</label>
                            </div>
                            <div class="quiz-option">
                                <input type="radio" name="q5" value="C" id="q5c">
                                <label for="q5c">C. Link your savings account</label>
                            </div>
                            <div class="quiz-option">
                                <input type="radio" name="q5" value="D" id="q5d">
                                <label for="q5d">D. Ignore alerts</label>
                            </div>
                        </div>
                        
                        <h4 style="margin-top: 2rem; color: var(--primary-color);">True or False (5 questions)</h4>
                        
                        <div class="quiz-question" style="margin-top: 1.5rem;">
                            <strong>Question 6:</strong> You can deposit a check using your phone.
                        </div>
                        <div class="quiz-options">
                            <div class="quiz-option">
                                <input type="radio" name="q6" value="True" id="q6t">
                                <label for="q6t">True</label>
                            </div>
                            <div class="quiz-option">
                                <input type="radio" name="q6" value="False" id="q6f">
                                <label for="q6f">False</label>
                            </div>
                        </div>
                        
                        <div class="quiz-question">
                            <strong>Question 7:</strong> ATM fees only happen at the grocery store.
                        </div>
                        <div class="quiz-options">
                            <div class="quiz-option">
                                <input type="radio" name="q7" value="True" id="q7t">
                                <label for="q7t">True</label>
                            </div>
                            <div class="quiz-option">
                                <input type="radio" name="q7" value="False" id="q7f">
                                <label for="q7f">False</label>
                            </div>
                        </div>
                        
                        <div class="quiz-question">
                            <strong>Question 8:</strong> A credit union is owned by its members.
                        </div>
                        <div class="quiz-options">
                            <div class="quiz-option">
                                <input type="radio" name="q8" value="True" id="q8t">
                                <label for="q8t">True</label>
                            </div>
                            <div class="quiz-option">
                                <input type="radio" name="q8" value="False" id="q8f">
                                <label for="q8f">False</label>
                            </div>
                        </div>
                        
                        <div class="quiz-question">
                            <strong>Question 9:</strong> All banks charge monthly maintenance fees.
                        </div>
                        <div class="quiz-options">
                            <div class="quiz-option">
                                <input type="radio" name="q9" value="True" id="q9t">
                                <label for="q9t">True</label>
                            </div>
                            <div class="quiz-option">
                                <input type="radio" name="q9" value="False" id="q9f">
                                <label for="q9f">False</label>
                            </div>
                        </div>
                        
                        <div class="quiz-question">
                            <strong>Question 10:</strong> Having both a checking and a savings account is a smart money strategy.
                        </div>
                        <div class="quiz-options">
                            <div class="quiz-option">
                                <input type="radio" name="q10" value="True" id="q10t">
                                <label for="q10t">True</label>
                            </div>
                            <div class="quiz-option">
                                <input type="radio" name="q10" value="False" id="q10f">
                                <label for="q10f">False</label>
                            </div>
                        </div>
                        
                        <button class="btn btn-primary" onclick="checkQuiz(4)" style="margin-top: 2rem;">Check Answers</button>
                        <div id="quiz-results-4"></div>
                    </div>
                `
            }
        ]
            },
    5: {
        title: "Credit and Loans",
        sections: [
            {
                title: "Introduction & What is Credit?",
                content: `
                    <div class="module-section">
                        <h3>Introduction</h3>
                        <p>Credit is one of the most essential tools you'll use in your financial life. It can help you buy a car, pay for college, or even start a business. But when it's not managed properly, it can also lead to hard-to-escape debt. This module will explain how credit works, what loans really mean, and how to use both responsibly.</p>
                        
                        <h3 style="margin-top: 2rem;">What Is Credit?</h3>
                        <p>Credit is the ability to borrow money and pay it back later, usually with interest. It's based on trust—lenders trust that you'll repay what you owe. Every time you borrow money or use a credit card, you're building a record that shows how reliable you are with payments. This record helps create your <strong>credit score</strong>, a number between 300 and 850 that reflects your financial reputation.</p>
                        
                        <div class="highlight-box">
                            <h4>💡 Credit Scores</h4>
                            <p>A good credit score opens doors to better opportunities, such as lower interest rates and a higher chance of loan approval. A bad one can make borrowing expensive or even impossible.</p>
                            <p style="margin-top: 1rem;">Most Americans have a credit score of about <strong>715</strong>, according to Experian. Scores above <strong>750</strong> are considered excellent.</p>
                        </div>
                        
                        <div class="example-box" style="margin-top: 2rem;">
                            <h4>Fun fact:</h4>
                            <p>You can start building credit before age 18 by becoming an authorized user on a parent's or guardian's credit card. Their good credit habits can help boost your score early on.</p>
                        </div>
                    </div>
                `
            },
            {
                title: "Understanding Loans & Interest",
                content: `
                    <div class="module-section">
                        <h3>Understanding Loans</h3>
                        <p>A loan is money you borrow with the agreement to pay it back over time, usually with interest. There are two main types:</p>
                        
                        <div class="example-box">
                            <h4>Installment loans</h4>
                            <p>Like car loans or student loans, which you pay back in set monthly payments.</p>
                        </div>
                        
                        <div class="highlight-box">
                            <h4>Revolving credit</h4>
                            <p>Like credit cards, where you can borrow again as you pay off your balance.</p>
                        </div>
                        
                        <h4 style="margin-top: 2rem;">Loans are built on four key parts:</h4>
                        <ul>
                            <li><strong>Principal:</strong> The original amount you borrow</li>
                            <li><strong>Interest:</strong> The cost of borrowing</li>
                            <li><strong>Term:</strong> How long you have to pay it back</li>
                            <li><strong>Collateral:</strong> Something of value you agree to give up if you can't pay (like your car in an auto loan)</li>
                            </ul>
                        </div>
                    
                    <div class="module-section">
                        <h3 style="margin-top: 2rem;">Interest: The Price of Borrowing</h3>
                        <p>Interest is what lenders charge you for using their money. It's expressed as an Annual Percentage Rate (APR). The higher the rate, the more you'll pay over time.</p>
                        
                        <div class="example-box">
                            <h4>Example:</h4>
                            <p>If you borrow $1,000 with a 10% APR and take one year to pay it back, you'll owe $1,100 total. It doesn't sound like much, but over time, interest can add up fast.</p>
                        </div>
                        
                        <div class="highlight-box" style="margin-top: 2rem;">
                            <h4>⚠️ Important Stat</h4>
                            <p>The average credit card interest rate in 2024 was over <strong>22%</strong>, one of the highest on record.</p>
                            <p style="margin-top: 1rem;">This means a $100 purchase left unpaid for a year could cost $122 or more. The longer you take to pay off a balance, the more expensive your original purchase becomes.</p>
                        </div>
                    </div>
                `
            },
            {
                title: "Why Credit Scores Matter & Responsible Borrowing",
                content: `
                    <div class="module-section">
                        <h3>Why Credit Scores Matter</h3>
                        <p>Your credit score affects more than just loans. Employers, landlords, and even cell phone companies may check it. Scores are built from several factors:</p>
                        
                        <ul>
                            <li><strong>Payment history</strong> – Do you pay bills on time?</li>
                            <li><strong>Credit utilization</strong> – How much of your available credit are you using?</li>
                            <li><strong>Credit history length</strong> – How long you've had credit</li>
                            <li><strong>Credit mix</strong> – Different types of credit accounts</li>
                            <li><strong>New credit</strong> – How many recent credit applications have you made?</li>
                        </ul>
                        
                        <div class="highlight-box" style="margin-top: 2rem;">
                            <h4>💡 Most Important Factor</h4>
                            <p><strong>Payment history alone makes up 35% of your total score</strong>, so paying on time is the most critical thing you can do.</p>
                        </div>
                    </div>
                    
                    <div class="module-section">
                        <h3 style="margin-top: 2rem;">Responsible Borrowing</h3>
                        <p>Borrowing isn't bad—it's part of life. The goal is to make credit work for you, not against you. Here are some simple habits that lead to good credit:</p>
                        
                        <ul>
                            <li>Pay off balances in full whenever possible</li>
                            <li>Only borrow what you can afford to repay</li>
                            <li>Check your credit report at least once a year for free</li>
                            <li>Don't apply for too many credit cards at once</li>
                            </ul>
                        
                        <div class="example-box" style="margin-top: 2rem;">
                            <h4>The Long-Term Benefits</h4>
                            <p>If you manage credit wisely, it can help you buy a home, finance education, or even start a business. If you misuse it, you'll face late fees, high interest, and long-term damage to your financial reputation.</p>
                        </div>
                    </div>
                `
            },
            {
                title: "Debt: The Hidden Cost",
                content: `
                    <div class="module-section">
                        <h3>Debt: The Hidden Cost</h3>
                        <p>Debt isn't the same as credit. Credit is a tool. Debt is what happens when you can't pay it back on time. When debt piles up, it affects your mental health, your relationships, and your future opportunities.</p>
                        
                        <div class="highlight-box">
                            <h4>⚠️ Shocking Statistics</h4>
                            <ul>
                                <li>Americans owe more than <strong>$1 trillion in credit card debt</strong></li>
                                <li>The average U.S. household with credit card debt owes around <strong>$7,000</strong></li>
                                <li>Student loan debt exceeds <strong>$1.7 trillion</strong> in the U.S.</li>
                            </ul>
                        </div>
                        
                        <h4 style="margin-top: 2rem;">The Snowball Effect</h4>
                        <p>Let's say you owe $1,000 at 22% APR. If you only make minimum payments of about $30 a month, it could take you <strong>4+ years and cost you over $400 in interest alone</strong>. That's $1,400 total for a $1,000 purchase. The longer you carry a balance, the more you lose.</p>
                        
                        <div class="example-box" style="margin-top: 2rem;">
                            <h4>If you're already in debt, here's what to do:</h4>
                            <ul>
                                <li><strong>Stop using credit cards</strong> until balances are paid off</li>
                                <li><strong>Prioritize high-interest debt first</strong> (like credit cards over student loans)</li>
                                <li><strong>Make more than the minimum payment</strong> whenever possible</li>
                                <li><strong>Consider a balance transfer</strong> or debt consolidation if your credit is decent</li>
                                <li><strong>Talk to a nonprofit credit counselor</strong> if you're overwhelmed</li>
                            </ul>
                        </div>
                    </div>
                `
            },
            {
                title: "Summary",
                content: `
                    <div class="module-section">
                        <h3>Summary</h3>
                        <p>Credit is a tool that can help you reach your goals—or pull you backward if mismanaged. Loans and interest are facts of adult life, but understanding how they work gives you the power to make smart choices. Your credit score reflects your financial habits, and over time, those habits either open or close doors.</p>
                        
                        <div class="highlight-box" style="margin-top: 2rem;">
                            <h4>✅ Key Takeaways</h4>
                            <ul>
                                <li>Credit and loans are based on trust and responsibility</li>
                                <li>Interest makes borrowing expensive, especially over time</li>
                                <li>Your credit score matters more than you think</li>
                                <li>Debt can snowball fast—pay it down aggressively</li>
                                <li>Good credit habits today save you money tomorrow</li>
                            </ul>
                        </div>
                        
                        <p style="margin-top: 2rem;">Remember: you don't need to be perfect. You just need to be intentional.</p>
                    </div>
                `
            },
            {
                title: "Module 5 Quiz",
                content: `
                        <div class="quiz-container">
                        <h3>Module 5 Quiz: Credit and Loans</h3>
                        <p><em>Please note, this is purely a self-graded quiz and only aims to help you assess your understanding of the Module. Should you get a score below 5/10, consider reviewing the Module and the provided links again to improve your understanding of the topic.</em></p>
                        
                        <h4 style="margin-top: 2rem; color: var(--primary-color);">Part A: Multiple Choice (5 questions)</h4>
                        
                        <div class="quiz-question" style="margin-top: 1.5rem;">
                            <strong>Question 1:</strong> What is credit?
                        </div>
                        <div class="quiz-options">
                            <div class="quiz-option">
                                <input type="radio" name="q1" value="A" id="q1a">
                                <label for="q1a">A. A score that measures how rich you are</label>
                            </div>
                            <div class="quiz-option">
                                <input type="radio" name="q1" value="B" id="q1b">
                                <label for="q1b">B. The ability to borrow money with the promise to pay it back</label>
                            </div>
                            <div class="quiz-option">
                                <input type="radio" name="q1" value="C" id="q1c">
                                <label for="q1c">C. A type of savings account</label>
                            </div>
                            <div class="quiz-option">
                                <input type="radio" name="q1" value="D" id="q1d">
                                <label for="q1d">D. A government loan program</label>
                            </div>
                        </div>
                        
                        <div class="quiz-question">
                            <strong>Question 2:</strong> What does APR stand for?
                        </div>
                        <div class="quiz-options">
                            <div class="quiz-option">
                                <input type="radio" name="q2" value="A" id="q2a">
                                <label for="q2a">A. Applied Payment Rate</label>
                            </div>
                            <div class="quiz-option">
                                <input type="radio" name="q2" value="B" id="q2b">
                                <label for="q2b">B. Authorized Principal Rollover</label>
                            </div>
                            <div class="quiz-option">
                                <input type="radio" name="q2" value="C" id="q2c">
                                <label for="q2c">C. Annual Percentage Rate</label>
                            </div>
                            <div class="quiz-option">
                                <input type="radio" name="q2" value="D" id="q2d">
                                <label for="q2d">D. Adjusted Premium Rate</label>
                            </div>
                        </div>
                        
                        <div class="quiz-question">
                            <strong>Question 3:</strong> Which of the following is an installment loan?
                        </div>
                        <div class="quiz-options">
                            <div class="quiz-option">
                                <input type="radio" name="q3" value="A" id="q3a">
                                <label for="q3a">A. A credit card</label>
                            </div>
                            <div class="quiz-option">
                                <input type="radio" name="q3" value="B" id="q3b">
                                <label for="q3b">B. A line of credit</label>
                            </div>
                            <div class="quiz-option">
                                <input type="radio" name="q3" value="C" id="q3c">
                                <label for="q3c">C. An auto loan</label>
                            </div>
                            <div class="quiz-option">
                                <input type="radio" name="q3" value="D" id="q3d">
                                <label for="q3d">D. A grocery store card</label>
                            </div>
                        </div>
                        
                        <div class="quiz-question">
                            <strong>Question 4:</strong> What is the most important factor in your credit score?
                        </div>
                        <div class="quiz-options">
                            <div class="quiz-option">
                                <input type="radio" name="q4" value="A" id="q4a">
                                <label for="q4a">A. How much money you make</label>
                            </div>
                            <div class="quiz-option">
                                <input type="radio" name="q4" value="B" id="q4b">
                                <label for="q4b">B. Your payment history</label>
                            </div>
                            <div class="quiz-option">
                                <input type="radio" name="q4" value="C" id="q4c">
                                <label for="q4c">C. The color of your credit card</label>
                            </div>
                            <div class="quiz-option">
                                <input type="radio" name="q4" value="D" id="q4d">
                                <label for="q4d">D. How many cards you own</label>
                            </div>
                        </div>
                        
                        <div class="quiz-question">
                            <strong>Question 5:</strong> Sophie has a credit card with a $1,000 limit. She currently owes $800. What is her credit utilization?
                        </div>
                        <div class="quiz-options">
                            <div class="quiz-option">
                                <input type="radio" name="q5" value="A" id="q5a">
                                <label for="q5a">A. 50%</label>
                            </div>
                            <div class="quiz-option">
                                <input type="radio" name="q5" value="B" id="q5b">
                                <label for="q5b">B. 60%</label>
                            </div>
                            <div class="quiz-option">
                                <input type="radio" name="q5" value="C" id="q5c">
                                <label for="q5c">C. 80%</label>
                            </div>
                            <div class="quiz-option">
                                <input type="radio" name="q5" value="D" id="q5d">
                                <label for="q5d">D. 100%</label>
                            </div>
                        </div>
                        
                        <h4 style="margin-top: 2rem; color: var(--primary-color);">Part B: True or False (5 questions)</h4>
                        
                        <div class="quiz-question" style="margin-top: 1.5rem;">
                            <strong>Question 6:</strong> You can start building credit before the age of 18 by becoming an authorized user on a parent's card.
                        </div>
                        <div class="quiz-options">
                            <div class="quiz-option">
                                <input type="radio" name="q6" value="True" id="q6t">
                                <label for="q6t">True</label>
                            </div>
                            <div class="quiz-option">
                                <input type="radio" name="q6" value="False" id="q6f">
                                <label for="q6f">False</label>
                            </div>
                        </div>
                        
                        <div class="quiz-question">
                            <strong>Question 7:</strong> The average credit card interest rate in 2024 was above 20%.
                        </div>
                        <div class="quiz-options">
                            <div class="quiz-option">
                                <input type="radio" name="q7" value="True" id="q7t">
                                <label for="q7t">True</label>
                            </div>
                            <div class="quiz-option">
                                <input type="radio" name="q7" value="False" id="q7f">
                                <label for="q7f">False</label>
                            </div>
                        </div>
                        
                        <div class="quiz-question">
                            <strong>Question 8:</strong> It's a good idea to max out your credit card every month as long as you pay it off.
                        </div>
                        <div class="quiz-options">
                            <div class="quiz-option">
                                <input type="radio" name="q8" value="True" id="q8t">
                                <label for="q8t">True</label>
                            </div>
                            <div class="quiz-option">
                                <input type="radio" name="q8" value="False" id="q8f">
                                <label for="q8f">False</label>
                            </div>
                        </div>
                        
                        <div class="quiz-question">
                            <strong>Question 9:</strong> Debt and credit are the same thing.
                        </div>
                        <div class="quiz-options">
                            <div class="quiz-option">
                                <input type="radio" name="q9" value="True" id="q9t">
                                <label for="q9t">True</label>
                            </div>
                            <div class="quiz-option">
                                <input type="radio" name="q9" value="False" id="q9f">
                                <label for="q9f">False</label>
                            </div>
                        </div>
                        
                        <div class="quiz-question">
                            <strong>Question 10:</strong> If you're struggling with debt, making more than the minimum payment can help you pay it off faster and save on interest.
                        </div>
                        <div class="quiz-options">
                            <div class="quiz-option">
                                <input type="radio" name="q10" value="True" id="q10t">
                                <label for="q10t">True</label>
                            </div>
                            <div class="quiz-option">
                                <input type="radio" name="q10" value="False" id="q10f">
                                <label for="q10f">False</label>
                            </div>
                        </div>
                        
                        <button class="btn btn-primary" onclick="checkQuiz(5)" style="margin-top: 2rem;">Check Answers</button>
                        <div id="quiz-results-5"></div>
                    </div>
                `
            }
        ]
    },
    6: {
        title: "Investing for Beginners",
        sections: [
            {
                title: "Introduction",
                content: `
                    <div class="module-section">
                        <h3>Introduction</h3>
                        <p>Saving money is important, but saving alone won't make you wealthy. Inflation slowly reduces the value of your cash over time, meaning that $100 today won't buy the same amount in ten years. Investing is how people grow their money faster than inflation and build wealth for the future. This module will show you why investing matters, what your options are, and how you can start, even with just a few dollars.</p>
                        
                        <div class="highlight-box" style="margin-top: 2rem;">
                            <h4>💡 Key Point</h4>
                            <p>Investing isn't just for the wealthy—it's a tool that can help anyone build wealth over time, regardless of how much you start with.</p>
                        </div>
                    </div>
                `
            },
            {
                title: "Why You Should Invest",
                content: `
                    <div class="module-section">
                        <h3>Why You Should Invest</h3>
                        <p>Investing is simply putting your money to work so it earns more money. Instead of letting your cash sit idle in a checking account, you can buy assets—like stocks or bonds—that increase in value or pay you interest. Over time, that growth adds up.</p>
                        
                        <div class="example-box" style="margin-top: 2rem;">
                            <h4>Real Example</h4>
                            <p>Imagine you save $100 every month but never invest it. After 10 years, you'll have $12,000. If you invested that same $100 a month in the stock market and earned an average 8% return, you'd have nearly $18,300. That's $6,300 more—just by putting your money to work.</p>
                        </div>
                        
                        <div class="highlight-box" style="margin-top: 2rem;">
                            <h4>📊 Fun Fact</h4>
                            <p>About 58% of Americans own stocks, either directly or through retirement accounts. Those who start early tend to build the most wealth because of one powerful concept—compound interest.</p>
                        </div>
                    </div>
                `
            },
            {
                title: "Compound Interest and the Time Value of Money",
                content: `
                    <div class="module-section">
                        <h3>Compound Interest and the Time Value of Money</h3>
                        <p>Compound interest means you earn interest on your original money and on the interest it has already earned. It's often called the "snowball effect" because your money keeps building on itself.</p>
                        
                        <div class="example-box" style="margin-top: 2rem;">
                            <h4>Step-by-Step Example</h4>
                            <p>You invest $1,000 at an 8% annual growth rate.</p>
                            <ul>
                                <li>After one year, you have $1,080</li>
                                <li>The following year, you earn 8% on $1,080—not just the original $1,000</li>
                                <li>After 10 years, you'd have over $2,100, more than double your original amount</li>
                        </ul>
                        </div>
                        
                        <div class="highlight-box" style="margin-top: 2rem;">
                            <h4>💭 Einstein's Wisdom</h4>
                            <p>Albert Einstein once called compound interest the "eighth wonder of the world." It rewards patience and consistency. The earlier you start investing, the more time your money has to grow.</p>
                        </div>
                    </div>
                `
            },
            {
                title: "Stocks, Bonds, Mutual Funds, and ETFs – Simplified",
                content: `
                    <div class="module-section">
                        <h3>Stocks, Bonds, Mutual Funds, and ETFs – Simplified</h3>
                        <p>There are many ways to invest, but these are the most common and beginner-friendly types:</p>
                        
                        <div class="example-box" style="margin-top: 2rem;">
                            <h4>Stocks</h4>
                            <p>When you buy a stock, you own a small piece of a company. If the company grows and profits, your stock's value can increase. Stocks have the highest potential returns but also higher risk.</p>
                        </div>
                        
                        <div class="highlight-box">
                            <h4>Bonds</h4>
                            <p>Bonds are like loans you give to companies or governments. They pay you interest in return. Bonds are typically safer than stocks, but they also grow more slowly.</p>
                        </div>
                        
                        <div class="example-box">
                            <h4>Mutual Funds</h4>
                            <p>These are groups of many different stocks and bonds bundled together. A professional manager decides what's included. Mutual funds are significant for diversification, meaning you don't rely on just one company's success.</p>
                        </div>
                        
                        <div class="highlight-box">
                            <h4>ETFs (Exchange-Traded Funds)</h4>
                            <p>Similar to mutual funds, but they trade on the stock market like regular stocks. They often have lower fees and are easy to buy and sell. Many ETFs track popular indexes, such as the S&P 500, which tracks the 500 largest U.S. companies.</p>
                        </div>
                        
                        <div class="quiz-container" style="margin-top: 2rem;">
                            <h4>📈 Fun Statistic</h4>
                            <p>The S&P 500 has averaged about 10% annual returns over the last 50 years. That means money invested in it roughly doubles every seven years if you stay invested.</p>
                        </div>
                    </div>
                `
            },
            {
                title: "How to Open a Brokerage Account",
                content: `
                    <div class="module-section">
                        <h3>How to Open a Brokerage Account</h3>
                        <p>A brokerage account is what lets you buy and sell investments. Think of it as the online "hub" for your investing activity.</p>
                        
                        <h4 style="margin-top: 2rem;">Here's how to open one:</h4>
                        
                        <div class="example-box">
                            <h4>Step 1: Choose a Platform</h4>
                            <p>Popular choices include Fidelity, Charles Schwab, Vanguard, and online apps like Robinhood or Webull.</p>
                        </div>
                        
                        <div class="highlight-box">
                            <h4>Step 2: Provide Your Information</h4>
                            <p>You'll need basic personal details, such as your Social Security number and bank account information.</p>
                        </div>
                        
                        <div class="example-box">
                            <h4>Step 3: Deposit Money</h4>
                            <p>You can transfer funds directly from your bank.</p>
                        </div>
                        
                        <div class="highlight-box">
                            <h4>Step 4: Start Small</h4>
                            <p>Many platforms let you buy fractional shares—small portions of a stock—so you can begin with as little as $10.</p>
                        </div>
                        
                        <div class="quiz-container" style="margin-top: 2rem;">
                            <h4>⚠️ Important Tip</h4>
                            <p>Always start by learning how the app or website works. Stick to simple investments like index funds or ETFs while you're still learning.</p>
                        </div>
                    </div>
                `
            },
            {
                title: "Intro to Retirement Accounts (Roth IRA, 401k)",
                content: `
                    <div class="module-section">
                        <h3>Intro to Retirement Accounts (Roth IRA, 401k)</h3>
                        <p>Retirement might feel far away, but investing early makes a huge difference. Retirement accounts offer tax benefits to help your money grow faster.</p>
                        
                        <div class="example-box" style="margin-top: 2rem;">
                            <h4>401(k)</h4>
                            <p>Offered by many employers, this account lets you invest part of your paycheck before taxes are taken out. Some employers even match your contributions, which is basically free money.</p>
                        </div>
                        
                        <div class="highlight-box">
                            <h4>Roth IRA</h4>
                            <p>A personal retirement account you can open yourself. You pay taxes on your contributions now, but your withdrawals later in life are entirely tax-free.</p>
                        </div>
                        
                        <div class="quiz-container" style="margin-top: 2rem;">
                            <h4>💰 Powerful Example</h4>
                            <p>If you invest $100 a month in a Roth IRA starting at age 18, you could retire at 65 with nearly $500,000 (assuming an 8% return). Waiting just 10 years to start could cut that amount in half.</p>
                        </div>
                    </div>
                `
            },
            {
                title: "Risk vs. Reward",
                content: `
                    <div class="module-section">
                        <h3>Risk vs. Reward</h3>
                        <p>Every investment has risk. Risk is the possibility that the value of your investment will go down. The higher the potential reward, the higher the risk tends to be.</p>
                        
                        <div class="example-box" style="margin-top: 2rem;">
                            <h4>Risk Levels</h4>
                            <p>Stocks can swing up or down quickly, while bonds are usually more stable. The key is to find a balance that fits your goals and comfort level. Most experts suggest starting with diversified funds that include both stocks and bonds.</p>
                        </div>
                        
                        <div class="highlight-box">
                            <h4>Diversification</h4>
                            <p>One way to manage risk is diversification—spreading your investments across different asset types so that one bad investment doesn't ruin your portfolio.</p>
                        </div>
                        
                        <div class="quiz-container" style="margin-top: 2rem;">
                            <h4>💪 Success Strategy</h4>
                            <p>The most successful investors stay consistent. They don't panic when the market dips; they keep investing over time. Historically, the U.S. stock market has recovered from every downturn it's ever faced.</p>
                        </div>
                    </div>
                `
            },
            {
                title: "Summary",
                content: `
                    <div class="module-section">
                        <h3>Summary</h3>
                        <p>Investing isn't gambling—it's a long-term strategy for building wealth. Start small, learn as you go, and let time do the heavy lifting. The sooner you begin, the more powerful compounding becomes. Every dollar you invest today is a step toward financial freedom tomorrow.</p>
                        
                        <div class="highlight-box" style="margin-top: 2rem;">
                            <h4>✅ Key Takeaways</h4>
                            <ul>
                                <li>Investing beats inflation and builds wealth over time</li>
                                <li>Compound interest is your greatest ally—start early</li>
                                <li>Diversification helps manage risk</li>
                                <li>Retirement accounts offer valuable tax benefits</li>
                                <li>Consistency beats timing the market</li>
                            </ul>
                        </div>
                        
                        <p style="margin-top: 2rem;">Remember: You don't need to be perfect, just consistent. Start where you are, with what you have.</p>
                    </div>
                `
            },
            {
                title: "Module 6 Quiz",
                content: `
                        <div class="quiz-container">
                        <h3>Module 6 Quiz: Investing Basics</h3>
                        <p><em>Please note, this is purely a self-graded quiz and only aims to help you assess your understanding of the Module. Should you get a score below 7/10, consider reviewing the Module and the provided links again to improve your understanding of the topic.</em></p>
                        
                        <h4 style="margin-top: 2rem; color: var(--primary-color);">Part A: Multiple Choice (5 questions)</h4>
                        
                        <div class="quiz-question" style="margin-top: 1.5rem;">
                            <strong>Question 1:</strong> What is the main reason to invest instead of just saving?
                        </div>
                        <div class="quiz-options">
                            <div class="quiz-option">
                                <input type="radio" name="q1" value="A" id="q1a">
                                <label for="q1a">A. To spend money faster</label>
                            </div>
                            <div class="quiz-option">
                                <input type="radio" name="q1" value="B" id="q1b">
                                <label for="q1b">B. To grow money over time through returns</label>
                            </div>
                            <div class="quiz-option">
                                <input type="radio" name="q1" value="C" id="q1c">
                                <label for="q1c">C. To avoid paying taxes</label>
                            </div>
                            <div class="quiz-option">
                                <input type="radio" name="q1" value="D" id="q1d">
                                <label for="q1d">D. To borrow more money</label>
                            </div>
                        </div>
                        
                        <div class="quiz-question">
                            <strong>Question 2:</strong> Which type of investment represents ownership in a company?
                        </div>
                        <div class="quiz-options">
                            <div class="quiz-option">
                                <input type="radio" name="q2" value="A" id="q2a">
                                <label for="q2a">A. Bond</label>
                            </div>
                            <div class="quiz-option">
                                <input type="radio" name="q2" value="B" id="q2b">
                                <label for="q2b">B. Stock</label>
                            </div>
                            <div class="quiz-option">
                                <input type="radio" name="q2" value="C" id="q2c">
                                <label for="q2c">C. Mutual Fund</label>
                            </div>
                            <div class="quiz-option">
                                <input type="radio" name="q2" value="D" id="q2d">
                                <label for="q2d">D. ETF</label>
                            </div>
                        </div>
                        
                        <div class="quiz-question">
                            <strong>Question 3:</strong> What is compound interest?
                        </div>
                        <div class="quiz-options">
                            <div class="quiz-option">
                                <input type="radio" name="q3" value="A" id="q3a">
                                <label for="q3a">A. Interest that only grows on your original deposit</label>
                            </div>
                            <div class="quiz-option">
                                <input type="radio" name="q3" value="B" id="q3b">
                                <label for="q3b">B. Interest that grows on both your original money and past earnings</label>
                            </div>
                            <div class="quiz-option">
                                <input type="radio" name="q3" value="C" id="q3c">
                                <label for="q3c">C. A type of loan</label>
                            </div>
                            <div class="quiz-option">
                                <input type="radio" name="q3" value="D" id="q3d">
                                <label for="q3d">D. Money the government gives you</label>
                            </div>
                        </div>
                        
                        <div class="quiz-question">
                            <strong>Question 4:</strong> Which account lets you invest pre-tax income through an employer?
                        </div>
                        <div class="quiz-options">
                            <div class="quiz-option">
                                <input type="radio" name="q4" value="A" id="q4a">
                                <label for="q4a">A. Roth IRA</label>
                            </div>
                            <div class="quiz-option">
                                <input type="radio" name="q4" value="B" id="q4b">
                                <label for="q4b">B. Checking Account</label>
                            </div>
                            <div class="quiz-option">
                                <input type="radio" name="q4" value="C" id="q4c">
                                <label for="q4c">C. 401(k)</label>
                            </div>
                            <div class="quiz-option">
                                <input type="radio" name="q4" value="D" id="q4d">
                                <label for="q4d">D. Savings Account</label>
                            </div>
                        </div>
                        
                        <div class="quiz-question">
                            <strong>Question 5:</strong> Which is a benefit of diversification?
                        </div>
                        <div class="quiz-options">
                            <div class="quiz-option">
                                <input type="radio" name="q5" value="A" id="q5a">
                                <label for="q5a">A. Increases risk</label>
                            </div>
                            <div class="quiz-option">
                                <input type="radio" name="q5" value="B" id="q5b">
                                <label for="q5b">B. Reduces taxes</label>
                            </div>
                            <div class="quiz-option">
                                <input type="radio" name="q5" value="C" id="q5c">
                                <label for="q5c">C. Spreads out risk across investments</label>
                            </div>
                            <div class="quiz-option">
                                <input type="radio" name="q5" value="D" id="q5d">
                                <label for="q5d">D. Guarantees profits</label>
                            </div>
                        </div>
                        
                        <h4 style="margin-top: 2rem; color: var(--primary-color);">Part B: True or False (5 questions)</h4>
                        
                        <div class="quiz-question" style="margin-top: 1.5rem;">
                            <strong>Question 6:</strong> Investing is only for rich people.
                        </div>
                        <div class="quiz-options">
                            <div class="quiz-option">
                                <input type="radio" name="q6" value="True" id="q6t">
                                <label for="q6t">True</label>
                            </div>
                            <div class="quiz-option">
                                <input type="radio" name="q6" value="False" id="q6f">
                                <label for="q6f">False</label>
                            </div>
                        </div>
                        
                        <div class="quiz-question">
                            <strong>Question 7:</strong> You can open a brokerage account as a teenager with a parent's help.
                        </div>
                        <div class="quiz-options">
                            <div class="quiz-option">
                                <input type="radio" name="q7" value="True" id="q7t">
                                <label for="q7t">True</label>
                            </div>
                            <div class="quiz-option">
                                <input type="radio" name="q7" value="False" id="q7f">
                                <label for="q7f">False</label>
                            </div>
                        </div>
                        
                        <div class="quiz-question">
                            <strong>Question 8:</strong> The S&P 500 is made up of 500 large U.S. companies.
                        </div>
                        <div class="quiz-options">
                            <div class="quiz-option">
                                <input type="radio" name="q8" value="True" id="q8t">
                                <label for="q8t">True</label>
                            </div>
                            <div class="quiz-option">
                                <input type="radio" name="q8" value="False" id="q8f">
                                <label for="q8f">False</label>
                            </div>
                        </div>
                        
                        <div class="quiz-question">
                            <strong>Question 9:</strong> Bonds usually have higher returns and higher risk than stocks.
                        </div>
                        <div class="quiz-options">
                            <div class="quiz-option">
                                <input type="radio" name="q9" value="True" id="q9t">
                                <label for="q9t">True</label>
                            </div>
                            <div class="quiz-option">
                                <input type="radio" name="q9" value="False" id="q9f">
                                <label for="q9f">False</label>
                            </div>
                        </div>
                        
                        <div class="quiz-question">
                            <strong>Question 10:</strong> Starting early gives your investments more time to compound.
                        </div>
                        <div class="quiz-options">
                            <div class="quiz-option">
                                <input type="radio" name="q10" value="True" id="q10t">
                                <label for="q10t">True</label>
                            </div>
                            <div class="quiz-option">
                                <input type="radio" name="q10" value="False" id="q10f">
                                <label for="q10f">False</label>
                            </div>
                        </div>
                        
                        <button class="btn btn-primary" onclick="checkQuiz(6)" style="margin-top: 2rem;">Check Answers</button>
                        <div id="quiz-results-6"></div>
                    </div>
                `
            }
        ]
            },
    7: {
        title: "Earning More: Side Hustles & Income Growth",
        sections: [
            {
                title: "Introduction",
                content: `
                    <div class="module-section">
                        <h3>Introduction</h3>
                        <p>Real wealth doesn't come from a single paycheck. It's built from layers of income—your main job, smart investing, and side projects that bring in extra cash. This combination gives you security, flexibility, and options. A 2024 survey by Zapier found that nearly 40% of Americans have a side hustle, with many earning more than $500 a month from it. That extra money can pay down debt, cover bills, or be invested for long-term growth. The goal isn't to work nonstop but to make your time and money work in more than one way.</p>
                        
                        <div class="highlight-box" style="margin-top: 2rem;">
                            <h4>💡 Key Insight</h4>
                            <p>The goal isn't to work nonstop but to make your time and money work in more than one way. Every extra dollar brings you closer to financial freedom.</p>
                        </div>
                    </div>
                `
            },
            {
                title: "The Power of Multiple Income Streams",
                content: `
                    <div class="module-section">
                        <h3>The Power of Multiple Income Streams</h3>
                        <p>Relying on one source of income leaves you vulnerable if something changes. Having a few smaller sources creates a safety net and gives you control over your finances.</p>
                        
                        <div class="example-box" style="margin-top: 2rem;">
                            <h4>Three-Layer Income Strategy</h4>
                            <ul>
                                <li><strong>A job</strong> provides consistent income and benefits</li>
                                <li><strong>Investing</strong> helps your money grow passively over time</li>
                                <li><strong>A side hustle</strong> adds flexibility and can grow into something bigger</li>
                            </ul>
                        </div>
                        
                        <div class="highlight-box" style="margin-top: 2rem;">
                            <h4>💰 Compound Effect</h4>
                            <p>Even small amounts of extra income can make a difference when used strategically. Over time, that cash flow can be reinvested, saved, or used to fund opportunities that help you reach financial independence faster.</p>
                        </div>
                    </div>
                `
            },
            {
                title: "Finding the Right Side Hustle",
                content: `
                    <div class="module-section">
                        <h3>Finding the Right Side Hustle</h3>
                        <p>The best side hustles match your skills, interests, and available time. Start by thinking about what people already ask you for help with or what comes naturally to you. Maybe you're great with kids and could tutor or babysit. Maybe you enjoy fixing things or are creative and could sell art or designs online. Small, consistent work adds up if you approach it seriously.</p>
                        
                        <div class="example-box" style="margin-top: 2rem;">
                            <h4>Common Starting Points</h4>
                            <ul>
                                <li>Tutoring or teaching a skill (languages, music, sports, academics)</li>
                                <li>Freelance work, such as writing, editing, or graphic design</li>
                                <li>Online reselling of clothes, sneakers, or collectibles</li>
                                <li>Task-based gigs such as dog walking, delivery driving, or helping with moving</li>
                            </ul>
                        </div>
                        
                        <div class="highlight-box" style="margin-top: 2rem;">
                            <h4>🎯 Sweet Spot</h4>
                            <p>The best opportunities often sit where your interests and the market meet—something you enjoy that others are willing to pay for.</p>
                        </div>
                    </div>
                `
            },
            {
                title: "Freelancing, Gig Work, and Online Services",
                content: `
                    <div class="module-section">
                        <h3>Freelancing, Gig Work, and Online Services</h3>
                        <p>Freelancing and gig work are popular because they give you control over your time. Sites like Fiverr, Upwork, and TaskRabbit make it easy to find short-term work with minimal experience. You can edit videos, design logos, manage social media, or assemble furniture—all for clients who need quick help. For students or young adults, these jobs are ideal for practicing time management and building communication skills.</p>
                        
                        <div class="example-box" style="margin-top: 2rem;">
                            <h4>Online Service Opportunities</h4>
                            <p>Online services also create space for creativity. Selling digital art, designing websites, or managing social accounts for small businesses can all generate income with minimal upfront cost. You can also explore e-commerce through platforms like Etsy, eBay, or Shopify. Many people build small brands selling homemade products, vintage clothing, or even digital templates.</p>
                        </div>
                        
                        <div class="highlight-box" style="margin-top: 2rem;">
                            <h4>📱 Fun Fact</h4>
                            <p>As of 2025, about 5 million Americans make money by creating online content—from short videos and blogs to podcasts and product reviews. While most don't make huge sums, many use their earnings to invest, save, or fund future projects.</p>
                        </div>
                    </div>
                `
            },
            {
                title: "Monetizing Skills and Hobbies",
                content: `
                    <div class="module-section">
                        <h3>Monetizing Skills and Hobbies</h3>
                        <p>The easiest way to stay consistent with a side hustle is to do something you already enjoy. Turning a hobby into income keeps it from feeling like work. Musicians can offer lessons, gamers can stream or coach, and athletes can train younger players. If you enjoy fashion, try reselling thrift finds. If you're organized, offer scheduling or virtual assistant services.</p>
                        
                        <div class="example-box" style="margin-top: 2rem;">
                            <h4>Hobby-to-Income Examples</h4>
                            <ul>
                                <li><strong>Music:</strong> Offer lessons or perform at events</li>
                                <li><strong>Gaming:</strong> Stream or coach other players</li>
                                <li><strong>Sports:</strong> Train younger players or referee</li>
                                <li><strong>Fashion:</strong> Resell thrift finds or style consultations</li>
                                <li><strong>Organization:</strong> Virtual assistant or scheduling services</li>
                            </ul>
                        </div>
                        
                        <div class="highlight-box" style="margin-top: 2rem;">
                            <h4>🧠 Entrepreneurial Mindset</h4>
                            <p>Not every hobby needs to become a business, but experimenting helps you learn what's sustainable. It's less about making quick money and more about developing habits that help you think like an entrepreneur—identifying value and providing it in exchange for income.</p>
                        </div>
                    </div>
                `
            },
            {
                title: "Avoiding Scams",
                content: `
                    <div class="module-section">
                        <h3>Avoiding Scams</h3>
                        <p>Unfortunately, side hustles attract scammers, too. You'll see fake "remote jobs" or "investment opportunities" that promise fast money—a good rule: real jobs pay you, not the other way around. You shouldn't have to send money upfront to start working. Be cautious of companies that pressure you to act quickly, refuse to share details, or use vague job descriptions.</p>
                        
                        <div class="example-box" style="margin-top: 2rem;">
                            <h4>Red Flags to Watch For</h4>
                            <ul>
                                <li>Pay fees upfront to start working</li>
                                <li>Unrealistic promises of guaranteed income</li>
                                <li>No clear job description or requirements</li>
                                <li>Pressure to act quickly without thinking</li>
                                <li>Requests for personal banking info before payment</li>
                            </ul>
                        </div>
                        
                        <div class="highlight-box" style="margin-top: 2rem;">
                            <h4>🛡️ Safety Tips</h4>
                            <ul>
                                <li>Research companies and look for verified reviews</li>
                                <li>Avoid offers that ask for personal banking info before payment</li>
                                <li>Use trusted platforms with secure payment systems</li>
                                <li>Be wary of "training fees" or promises of guaranteed income</li>
                            </ul>
                        </div>
                    </div>
                `
            },
            {
                title: "Budgeting and Taxes for Side Income",
                content: `
                    <div class="module-section">
                        <h3>Budgeting and Taxes for Side Income</h3>
                        <p>When money starts coming in, treat it like a small business. Track how much you earn and how much you spend on supplies or tools. Apps like Mint or Notion can help you organize everything. A simple spreadsheet is often enough.</p>
                        
                        <div class="example-box" style="margin-top: 2rem;">
                            <h4>Tax Planning</h4>
                            <p>Side hustle income is usually untaxed when you receive it, meaning you'll owe taxes later. Setting aside 25–30% of your earnings prevents surprises during tax season. If you make more than $600 from one client, they'll typically send you a 1099 form showing your earnings.</p>
                        </div>
                        
                        <div class="highlight-box" style="margin-top: 2rem;">
                            <h4>📊 Expense Tracking</h4>
                            <p>Keeping receipts and logging expenses can also help you deduct costs like materials, subscriptions, or travel related to your work. Even if your side hustle is small, understanding taxes early enables you to avoid problems and prepares you for managing larger income in the future.</p>
                        </div>
                    </div>
                `
            },
            {
                title: "Building Toward Real Wealth",
                content: `
                    <div class="module-section">
                        <h3>Building Toward Real Wealth</h3>
                        <p>Every dollar you earn from a side hustle brings you closer to financial freedom. It's not just about extra cash—it's about building habits, learning to manage clients, understanding taxes, and using money intentionally. As you grow, that income can fund investments, education, or even the start of a larger business.</p>
                        
                        <div class="example-box" style="margin-top: 2rem;">
                            <h4>The Wealth-Building Cycle</h4>
                            <p>Financial independence doesn't come overnight, but it starts with simple steps: earn, save, and reinvest. Your main job keeps you stable, your investments grow your wealth, and your side hustles create the flexibility to take control of your future.</p>
                        </div>
                        
                        <div class="highlight-box" style="margin-top: 2rem;">
                            <h4>✅ Key Takeaways</h4>
                            <ul>
                                <li>Multiple income streams provide security and flexibility</li>
                                <li>Start with skills and interests you already have</li>
                                <li>Protect yourself from scams and unrealistic promises</li>
                                <li>Track income and expenses for tax purposes</li>
                                <li>Use side hustle income strategically for long-term growth</li>
                            </ul>
                        </div>
                        
                        <p style="margin-top: 2rem;">Remember: Every successful entrepreneur started somewhere. Your side hustle today could be the foundation of your financial independence tomorrow.</p>
                        </div>
                `
            },
            {
                title: "Module 7 Quiz",
                content: `
                    <div class="quiz-container">
                        <h3>Module 7 Quiz: Earning More — Side Hustles & Income Growth</h3>
                        <p><em>Please note, this is purely a self-graded quiz and only aims to help you assess your understanding of the Module. Should you get a score below 7/10, consider reviewing the Module and the provided links again to improve your understanding of the topic.</em></p>
                        
                        <h4 style="margin-top: 2rem; color: var(--primary-color);">Part A: Multiple Choice (5 questions)</h4>
                        
                        <div class="quiz-question" style="margin-top: 1.5rem;">
                            <strong>Question 1:</strong> What is one benefit of having multiple income streams?
                        </div>
                        <div class="quiz-options">
                            <div class="quiz-option">
                                <input type="radio" name="q1" value="A" id="q1a">
                                <label for="q1a">A. It makes budgeting unnecessary</label>
                            </div>
                            <div class="quiz-option">
                                <input type="radio" name="q1" value="B" id="q1b">
                                <label for="q1b">B. It reduces financial risk</label>
                            </div>
                            <div class="quiz-option">
                                <input type="radio" name="q1" value="C" id="q1c">
                                <label for="q1c">C. It increases spending habits</label>
                            </div>
                            <div class="quiz-option">
                                <input type="radio" name="q1" value="D" id="q1d">
                                <label for="q1d">D. It guarantees higher credit</label>
                            </div>
                        </div>
                        
                        <div class="quiz-question">
                            <strong>Question 2:</strong> Which of the following is an example of a side hustle?
                        </div>
                        <div class="quiz-options">
                            <div class="quiz-option">
                                <input type="radio" name="q2" value="A" id="q2a">
                                <label for="q2a">A. Watching movies</label>
                            </div>
                            <div class="quiz-option">
                                <input type="radio" name="q2" value="B" id="q2b">
                                <label for="q2b">B. Tutoring a student for pay</label>
                            </div>
                            <div class="quiz-option">
                                <input type="radio" name="q2" value="C" id="q2c">
                                <label for="q2c">C. Taking online classes</label>
                            </div>
                            <div class="quiz-option">
                                <input type="radio" name="q2" value="D" id="q2d">
                                <label for="q2d">D. Using a credit card</label>
                            </div>
                        </div>
                        
                        <div class="quiz-question">
                            <strong>Question 3:</strong> What should you do to protect yourself from scams?
                        </div>
                        <div class="quiz-options">
                            <div class="quiz-option">
                                <input type="radio" name="q3" value="A" id="q3a">
                                <label for="q3a">A. Pay fees upfront</label>
                            </div>
                            <div class="quiz-option">
                                <input type="radio" name="q3" value="B" id="q3b">
                                <label for="q3b">B. Avoid researching opportunities</label>
                            </div>
                            <div class="quiz-option">
                                <input type="radio" name="q3" value="C" id="q3c">
                                <label for="q3c">C. Only use verified or reviewed platforms</label>
                            </div>
                            <div class="quiz-option">
                                <input type="radio" name="q3" value="D" id="q3d">
                                <label for="q3d">D. Share banking info early</label>
                            </div>
                        </div>
                        
                        <div class="quiz-question">
                            <strong>Question 4:</strong> How much should you typically save from side income for taxes?
                        </div>
                        <div class="quiz-options">
                            <div class="quiz-option">
                                <input type="radio" name="q4" value="A" id="q4a">
                                <label for="q4a">A. 5%</label>
                            </div>
                            <div class="quiz-option">
                                <input type="radio" name="q4" value="B" id="q4b">
                                <label for="q4b">B. 10%</label>
                            </div>
                            <div class="quiz-option">
                                <input type="radio" name="q4" value="C" id="q4c">
                                <label for="q4c">C. 25–30%</label>
                            </div>
                            <div class="quiz-option">
                                <input type="radio" name="q4" value="D" id="q4d">
                                <label for="q4d">D. None, since it's extra income</label>
                            </div>
                        </div>
                        
                        <div class="quiz-question">
                            <strong>Question 5:</strong> What's one reason hobbies make good side hustles?
                        </div>
                        <div class="quiz-options">
                            <div class="quiz-option">
                                <input type="radio" name="q5" value="A" id="q5a">
                                <label for="q5a">A. They never take time</label>
                            </div>
                            <div class="quiz-option">
                                <input type="radio" name="q5" value="B" id="q5b">
                                <label for="q5b">B. You already enjoy them</label>
                            </div>
                            <div class="quiz-option">
                                <input type="radio" name="q5" value="C" id="q5c">
                                <label for="q5c">C. They're guaranteed to profit</label>
                            </div>
                            <div class="quiz-option">
                                <input type="radio" name="q5" value="D" id="q5d">
                                <label for="q5d">D. They don't need effort</label>
                            </div>
                        </div>
                        
                        <h4 style="margin-top: 2rem; color: var(--primary-color);">Part B: True or False (5 questions)</h4>
                        
                        <div class="quiz-question" style="margin-top: 1.5rem;">
                            <strong>Question 6:</strong> Having a side hustle means quitting your primary job.
                        </div>
                        <div class="quiz-options">
                            <div class="quiz-option">
                                <input type="radio" name="q6" value="True" id="q6t">
                                <label for="q6t">True</label>
                            </div>
                            <div class="quiz-option">
                                <input type="radio" name="q6" value="False" id="q6f">
                                <label for="q6f">False</label>
                            </div>
                        </div>
                        
                        <div class="quiz-question">
                            <strong>Question 7:</strong> Freelancing gives flexibility to choose projects and hours.
                        </div>
                        <div class="quiz-options">
                            <div class="quiz-option">
                                <input type="radio" name="q7" value="True" id="q7t">
                                <label for="q7t">True</label>
                            </div>
                            <div class="quiz-option">
                                <input type="radio" name="q7" value="False" id="q7f">
                                <label for="q7f">False</label>
                            </div>
                        </div>
                        
                        <div class="quiz-question">
                            <strong>Question 8:</strong> All online opportunities are legitimate.
                        </div>
                        <div class="quiz-options">
                            <div class="quiz-option">
                                <input type="radio" name="q8" value="True" id="q8t">
                                <label for="q8t">True</label>
                            </div>
                            <div class="quiz-option">
                                <input type="radio" name="q8" value="False" id="q8f">
                                <label for="q8f">False</label>
                            </div>
                        </div>
                        
                        <div class="quiz-question">
                            <strong>Question 9:</strong> Tracking income helps with taxes and organization.
                        </div>
                        <div class="quiz-options">
                            <div class="quiz-option">
                                <input type="radio" name="q9" value="True" id="q9t">
                                <label for="q9t">True</label>
                            </div>
                            <div class="quiz-option">
                                <input type="radio" name="q9" value="False" id="q9f">
                                <label for="q9f">False</label>
                            </div>
                        </div>
                        
                        <div class="quiz-question">
                            <strong>Question 10:</strong> Building more income streams can help you reach financial independence faster.
                        </div>
                        <div class="quiz-options">
                            <div class="quiz-option">
                                <input type="radio" name="q10" value="True" id="q10t">
                                <label for="q10t">True</label>
                            </div>
                            <div class="quiz-option">
                                <input type="radio" name="q10" value="False" id="q10f">
                                <label for="q10f">False</label>
                            </div>
                        </div>
                        
                        <button class="btn btn-primary" onclick="checkQuiz(7)" style="margin-top: 2rem;">Check Answers</button>
                        <div id="quiz-results-7"></div>
                    </div>
                `
            }
        ]
    },
    8: {
        title: "Taxes and Legal Basics",
        sections: [
            {
                title: "Introduction",
                content: `
                    <div class="module-section">
                        <h3>Introduction</h3>
                        <p>Taxes are one of the few guarantees in life. They fund schools, roads, healthcare, and national defense—but for most people, they're also one of the most confusing parts of managing money. Learning how taxes work is essential because it affects every paycheck you'll ever earn. This module breaks down the basics of taxes in plain English so you'll know what's taken out of your income, how to file correctly, and how to make wise choices that can save you money in the future.</p>
                        
                        <div class="highlight-box" style="margin-top: 2rem;">
                            <h4>💡 Key Point</h4>
                            <p>Understanding taxes gives you control over your money. The more you know, the more you can save and plan for your financial future.</p>
                        </div>
                    </div>
                `
            },
            {
                title: "How Taxes Work",
                content: `
                    <div class="module-section">
                        <h3>How Taxes Work</h3>
                        <p>When you earn money from a job, the government collects a portion called income tax. This money funds federal, state, and sometimes local services. Federal income tax is collected by the IRS (Internal Revenue Service), while each state has its own tax rules.</p>
                        
                        <div class="example-box" style="margin-top: 2rem;">
                            <h4>How Withholding Works</h4>
                            <p>Your employer usually withholds taxes automatically from your paycheck based on a W-4 form you fill out when you start a job. The more allowances or dependents you claim, the less money will be withheld—but that also means you might owe more when you file later.</p>
                        </div>
                        
                        <div class="highlight-box" style="margin-top: 2rem;">
                            <h4>💰 Real Example</h4>
                            <p>If you earn $40,000 per year, around $3,000–$6,000 may go toward federal income tax depending on where you live and your deductions. That's before adding state taxes, which range from 0% (in states like Texas and Florida) to over 13% (in California).</p>
                        </div>
                        
                        <div class="quiz-container" style="margin-top: 2rem;">
                            <h4>📊 Fun Fact</h4>
                            <p>The IRS processes more than 260 million tax returns each year. Most are now filed online, making the process much faster than before.</p>
                        </div>
                    </div>
                `
            },
            {
                title: "Filing Your Taxes 101",
                content: `
                    <div class="module-section">
                        <h3>Filing Your Taxes 101</h3>
                        <p>Filing taxes means reporting how much money you earned in a year and how much tax you already paid. If you paid too much, you get a refund. If you didn't pay enough, you owe money.</p>
                        
                        <div class="example-box" style="margin-top: 2rem;">
                            <h4>Online Filing Options</h4>
                            <p>You can file your taxes online using services like TurboTax, H&R Block, or Cash App Taxes. Many of these platforms are free for basic returns. You'll receive tax forms from your job and any other income sources—most commonly a W-2 or 1099 form.</p>
                        </div>
                        
                        <div class="highlight-box" style="margin-top: 2rem;">
                            <h4>📋 Basic Filing Process</h4>
                            <ol>
                                <li><strong>Gather your forms:</strong> W-2 from your employer, 1099s if you did freelance or gig work, and receipts for deductible expenses</li>
                                <li><strong>Use an online filing service</strong> or work with a tax preparer</li>
                                <li><strong>Submit before the annual deadline,</strong> usually April 15</li>
                            </ol>
                        </div>
                        
                        <div class="quiz-container" style="margin-top: 2rem;">
                            <h4>⚠️ Important Note</h4>
                            <p>It's crucial to file on time even if you can't pay everything right away. Late filing can lead to heavy penalties.</p>
                        </div>
                        
                        <div class="example-box" style="margin-top: 2rem;">
                            <h4>📈 Filing Statistics</h4>
                            <p>Around 90% of U.S. taxpayers file electronically, and the average refund in 2024 was about $3,200. That's a lot of money people get back just by staying organized.</p>
                        </div>
                    </div>
                `
            },
            {
                title: "W-2 vs. 1099: Employment Types",
                content: `
                    <div class="module-section">
                        <h3>W-2 vs. 1099: Employment Types</h3>
                        <p>Understanding your employment type is key to managing taxes.</p>
                        
                        <div class="example-box" style="margin-top: 2rem;">
                            <h4>W-2 Employees</h4>
                            <p>W-2 employees are traditional workers—your employer withholds taxes automatically and sends you a W-2 form each January. Your taxes are simpler since most of the work is done for you.</p>
                        </div>
                        
                        <div class="highlight-box">
                            <h4>1099 Workers</h4>
                            <p>1099 workers, on the other hand, are independent contractors or freelancers. You're considered self-employed, meaning no taxes are withheld from your pay. Instead, you're responsible for setting aside part of your income (usually 20–30%) to pay later.</p>
                        </div>
                        
                        <div class="example-box">
                            <h4>Real-World Examples</h4>
                            <p>For example, if you drive for Uber or run an online side hustle, you'll likely receive a 1099 form. You'll also have to pay self-employment tax, which covers Social Security and Medicare contributions that employers usually handle.</p>
                        </div>
                    </div>
                `
            },
            {
                title: "How to Read Your Pay Stub",
                content: `
                    <div class="module-section">
                        <h3>How to Read Your Pay Stub</h3>
                        <p>Every pay stub lists what's being taken from your paycheck. Here's what to look for:</p>
                        
                        <div class="example-box" style="margin-top: 2rem;">
                            <h4>Key Pay Stub Terms</h4>
                            <ul>
                                <li><strong>Gross pay:</strong> What you earned before deductions</li>
                                <li><strong>Net pay:</strong> What you actually take home after taxes</li>
                                <li><strong>Federal income tax:</strong> Sent to the IRS</li>
                                <li><strong>State income tax:</strong> Goes to your state's government</li>
                                <li><strong>Social Security and Medicare (FICA):</strong> These support retired and elderly Americans</li>
                            </ul>
                        </div>
                        
                        <div class="highlight-box" style="margin-top: 2rem;">
                            <h4>💡 Why This Matters</h4>
                            <p>Understanding this breakdown helps you catch mistakes and know where your money's going. It also helps you plan your budget more accurately.</p>
                        </div>
                    </div>
                `
            },
            {
                title: "Tax Deductions and Credits",
                content: `
                    <div class="module-section">
                        <h3>Tax Deductions and Credits</h3>
                        <p>Deductions and credits lower how much tax you owe, but they work differently:</p>
                        
                        <div class="example-box" style="margin-top: 2rem;">
                            <h4>Deductions</h4>
                            <p>Deductions reduce your taxable income (for example, student loan interest or charitable donations).</p>
                        </div>
                        
                        <div class="highlight-box">
                            <h4>Credits</h4>
                            <p>Credits reduce your total tax bill directly (for example, the Earned Income Tax Credit).</p>
                        </div>
                        
                        <div class="example-box">
                            <h4>Student Benefits</h4>
                            <p>If you're a student, you may qualify for the American Opportunity Credit, which gives up to $2,500 back per year toward tuition expenses.</p>
                        </div>
                        
                        <div class="highlight-box" style="margin-top: 2rem;">
                            <h4>💰 Earned Income Tax Credit (EITC)</h4>
                            <p>For young workers, the Earned Income Tax Credit (EITC) can be a game changer. It's designed to help low- and moderate-income individuals keep more of what they earn. In 2024, over 25 million Americans claimed it, with an average credit of about $2,600.</p>
                        </div>
                    </div>
                `
            },
            {
                title: "State and Local Taxes",
                content: `
                    <div class="module-section">
                        <h3>State and Local Taxes</h3>
                        <p>In addition to federal taxes, most states have their own tax systems. Some charge a flat rate; others use a progressive system, meaning higher earners pay a higher percentage. A few states—like Texas, Florida, and Washington—don't collect state income tax at all.</p>
                        
                        <div class="example-box" style="margin-top: 2rem;">
                            <h4>No Income Tax States</h4>
                            <p>Even if your state doesn't have income tax, you'll still pay sales tax when you buy things and property tax if you own real estate. It's all part of how local governments fund public services like schools and emergency departments.</p>
                        </div>
                        
                        <div class="highlight-box" style="margin-top: 2rem;">
                            <h4>🏛️ Tax-Free States</h4>
                            <p>States with no income tax: Texas, Florida, Washington, Nevada, South Dakota, Wyoming, Alaska, New Hampshire, and Tennessee (on wages only).</p>
                        </div>
                    </div>
                `
            },
            {
                title: "Avoiding Common Tax Mistakes",
                content: `
                    <div class="module-section">
                        <h3>Avoiding Common Tax Mistakes</h3>
                        <p>Tax errors can cost you money or delay your refund. The most common mistakes include:</p>
                        
                        <div class="example-box" style="margin-top: 2rem;">
                            <h4>Common Filing Errors</h4>
                            <ul>
                                <li>Forgetting to sign your return</li>
                                <li>Entering the wrong Social Security number</li>
                                <li>Not reporting all income (primarily freelance or gig work)</li>
                                <li>Filing late without requesting an extension</li>
                            </ul>
                        </div>
                        
                        <div class="highlight-box" style="margin-top: 2rem;">
                            <h4>🛡️ Prevention Tips</h4>
                            <p>You can avoid most issues by double-checking your forms and filing electronically. Online tax software automatically catches minor errors before submission.</p>
                        </div>
                    </div>
                `
            },
            {
                title: "Legal Basics for Young Earners",
                content: `
                    <div class="module-section">
                        <h3>Legal Basics for Young Earners</h3>
                        <p>Beyond taxes, understanding your fundamental legal rights as a worker is essential. When you start earning income, you're protected by labor laws that guarantee minimum wage, limit how many hours minors can work, and ensure safe working conditions.</p>
                        
                        <div class="example-box" style="margin-top: 2rem;">
                            <h4>Contract Awareness</h4>
                            <p>If you ever sign a work contract or start freelancing, read the agreement carefully. Know what you're agreeing to—especially how and when you'll be paid. If something sounds off, ask questions or seek advice before signing.</p>
                        </div>
                        
                        <div class="highlight-box" style="margin-top: 2rem;">
                            <h4>💰 Minimum Wage Facts</h4>
                            <p>The federal minimum wage has been $7.25 since 2009, but many states have set higher minimums. Washington, D.C., currently leads with over $17 per hour.</p>
                        </div>
                    </div>
                `
            },
            {
                title: "Summary",
                content: `
                    <div class="module-section">
                        <h3>Summary</h3>
                        <p>Taxes might seem complicated, but they follow a system. The more you understand it, the more control you'll have over your money. Filing on time, keeping records, and knowing your deductions can save you hundreds—or even thousands—each year. Taxes are part of adult life, but when managed well, they're just another tool for planning your financial future.</p>
                        
                        <div class="highlight-box" style="margin-top: 2rem;">
                            <h4>✅ Key Takeaways</h4>
                            <ul>
                                <li>Taxes fund essential government services</li>
                                <li>W-2 employees have taxes withheld automatically</li>
                                <li>1099 workers are self-employed and handle their own taxes</li>
                                <li>Deductions reduce taxable income, credits reduce tax owed</li>
                                <li>File on time to avoid penalties</li>
                                <li>Know your legal rights as a worker</li>
                            </ul>
                        </div>
                        
                        <p style="margin-top: 2rem;">Remember: Understanding taxes isn't about avoiding them—it's about managing them wisely to keep more of your hard-earned money.</p>
                    </div>
                `
            },
            {
                title: "Module 8 Quiz",
                content: `
                    <div class="quiz-container">
                        <h3>Module 8 Quiz: Taxes and Legal Basics</h3>
                        <p><em>Please note, this is purely a self-graded quiz and only aims to help you assess your understanding of the Module. Should you get a score below 7/10, consider reviewing the Module and the provided links again to improve your understanding of the topic.</em></p>
                        
                        <h4 style="margin-top: 2rem; color: var(--primary-color);">Part A: Multiple Choice (5 questions)</h4>
                        
                        <div class="quiz-question" style="margin-top: 1.5rem;">
                            <strong>Question 1:</strong> What does the IRS stand for?
                        </div>
                        <div class="quiz-options">
                            <div class="quiz-option">
                                <input type="radio" name="q1" value="A" id="q1a">
                                <label for="q1a">A. Internal Revenue Service</label>
                            </div>
                            <div class="quiz-option">
                                <input type="radio" name="q1" value="B" id="q1b">
                                <label for="q1b">B. International Revenue System</label>
                            </div>
                            <div class="quiz-option">
                                <input type="radio" name="q1" value="C" id="q1c">
                                <label for="q1c">C. Income Reporting Service</label>
                            </div>
                            <div class="quiz-option">
                                <input type="radio" name="q1" value="D" id="q1d">
                                <label for="q1d">D. Independent Revenue Source</label>
                            </div>
                        </div>
                        
                        <div class="quiz-question">
                            <strong>Question 2:</strong> Which form do you receive if you're a traditional employee?
                        </div>
                        <div class="quiz-options">
                            <div class="quiz-option">
                                <input type="radio" name="q2" value="A" id="q2a">
                                <label for="q2a">A. 1099</label>
                            </div>
                            <div class="quiz-option">
                                <input type="radio" name="q2" value="B" id="q2b">
                                <label for="q2b">B. W-4</label>
                            </div>
                            <div class="quiz-option">
                                <input type="radio" name="q2" value="C" id="q2c">
                                <label for="q2c">C. W-2</label>
                            </div>
                            <div class="quiz-option">
                                <input type="radio" name="q2" value="D" id="q2d">
                                <label for="q2d">D. 1040</label>
                            </div>
                        </div>
                        
                        <div class="quiz-question">
                            <strong>Question 3:</strong> What is the main difference between a W-2 and a 1099 worker?
                        </div>
                        <div class="quiz-options">
                            <div class="quiz-option">
                                <input type="radio" name="q3" value="A" id="q3a">
                                <label for="q3a">A. W-2 workers file taxes twice a year</label>
                            </div>
                            <div class="quiz-option">
                                <input type="radio" name="q3" value="B" id="q3b">
                                <label for="q3b">B. 1099 workers are self-employed and handle their own taxes</label>
                            </div>
                            <div class="quiz-option">
                                <input type="radio" name="q3" value="C" id="q3c">
                                <label for="q3c">C. W-2 workers pay higher taxes</label>
                            </div>
                            <div class="quiz-option">
                                <input type="radio" name="q3" value="D" id="q3d">
                                <label for="q3d">D. 1099 workers can't file taxes</label>
                            </div>
                        </div>
                        
                        <div class="quiz-question">
                            <strong>Question 4:</strong> What is a tax credit?
                        </div>
                        <div class="quiz-options">
                            <div class="quiz-option">
                                <input type="radio" name="q4" value="A" id="q4a">
                                <label for="q4a">A. A reduction of taxable income</label>
                            </div>
                            <div class="quiz-option">
                                <input type="radio" name="q4" value="B" id="q4b">
                                <label for="q4b">B. A refund for overpaying</label>
                            </div>
                            <div class="quiz-option">
                                <input type="radio" name="q4" value="C" id="q4c">
                                <label for="q4c">C. A dollar-for-dollar reduction of taxes owed</label>
                            </div>
                            <div class="quiz-option">
                                <input type="radio" name="q4" value="D" id="q4d">
                                <label for="q4d">D. A government loan</label>
                            </div>
                        </div>
                        
                        <div class="quiz-question">
                            <strong>Question 5:</strong> What is the deadline for filing most tax returns in the U.S.?
                        </div>
                        <div class="quiz-options">
                            <div class="quiz-option">
                                <input type="radio" name="q5" value="A" id="q5a">
                                <label for="q5a">A. January 1</label>
                            </div>
                            <div class="quiz-option">
                                <input type="radio" name="q5" value="B" id="q5b">
                                <label for="q5b">B. March 1</label>
                            </div>
                            <div class="quiz-option">
                                <input type="radio" name="q5" value="C" id="q5c">
                                <label for="q5c">C. April 15</label>
                            </div>
                            <div class="quiz-option">
                                <input type="radio" name="q5" value="D" id="q5d">
                                <label for="q5d">D. May 30</label>
                            </div>
                        </div>
                        
                        <h4 style="margin-top: 2rem; color: var(--primary-color);">Part B: True or False (5 questions)</h4>
                        
                        <div class="quiz-question" style="margin-top: 1.5rem;">
                            <strong>Question 6:</strong> Filing your taxes late has no penalty if you owe money.
                        </div>
                        <div class="quiz-options">
                            <div class="quiz-option">
                                <input type="radio" name="q6" value="True" id="q6t">
                                <label for="q6t">True</label>
                            </div>
                            <div class="quiz-option">
                                <input type="radio" name="q6" value="False" id="q6f">
                                <label for="q6f">False</label>
                            </div>
                        </div>
                        
                        <div class="quiz-question">
                            <strong>Question 7:</strong> Deductions and credits both reduce your taxable income.
                        </div>
                        <div class="quiz-options">
                            <div class="quiz-option">
                                <input type="radio" name="q7" value="True" id="q7t">
                                <label for="q7t">True</label>
                            </div>
                            <div class="quiz-option">
                                <input type="radio" name="q7" value="False" id="q7f">
                                <label for="q7f">False</label>
                            </div>
                        </div>
                        
                        <div class="quiz-question">
                            <strong>Question 8:</strong> You are responsible for paying self-employment tax if you work as a freelancer.
                        </div>
                        <div class="quiz-options">
                            <div class="quiz-option">
                                <input type="radio" name="q8" value="True" id="q8t">
                                <label for="q8t">True</label>
                            </div>
                            <div class="quiz-option">
                                <input type="radio" name="q8" value="False" id="q8f">
                                <label for="q8f">False</label>
                            </div>
                        </div>
                        
                        <div class="quiz-question">
                            <strong>Question 9:</strong> Some states have no income tax.
                        </div>
                        <div class="quiz-options">
                            <div class="quiz-option">
                                <input type="radio" name="q9" value="True" id="q9t">
                                <label for="q9t">True</label>
                            </div>
                            <div class="quiz-option">
                                <input type="radio" name="q9" value="False" id="q9f">
                                <label for="q9f">False</label>
                            </div>
                        </div>
                        
                        <div class="quiz-question">
                            <strong>Question 10:</strong> The federal minimum wage is the same across all states.
                        </div>
                        <div class="quiz-options">
                            <div class="quiz-option">
                                <input type="radio" name="q10" value="True" id="q10t">
                                <label for="q10t">True</label>
                            </div>
                            <div class="quiz-option">
                                <input type="radio" name="q10" value="False" id="q10f">
                                <label for="q10f">False</label>
                            </div>
                        </div>
                        
                        <button class="btn btn-primary" onclick="checkQuiz(8)" style="margin-top: 2rem;">Check Answers</button>
                        <div id="quiz-results-8"></div>
                    </div>
                `
            }
        ]
    },
    9: {
        title: "Avoiding Common Financial Mistakes",
        sections: [
            {
                title: "Introduction",
                content: `
                    <div class="module-section">
                        <h3>Introduction</h3>
                        <p>Managing money isn't just about earning and investing—it's about avoiding the traps that keep people from building wealth. Most financial setbacks come from simple mistakes that start small but grow over time. Whether it's impulse spending, ignoring debt, or living paycheck to paycheck, bad habits can quietly eat away at your progress. This module focuses on recognizing and avoiding these common mistakes so you can stay in control of your money and your future.</p>
                        
                        <div class="highlight-box" style="margin-top: 2rem;">
                            <h4>💡 Key Point</h4>
                            <p>The goal isn't perfection—it's progress. Every dollar you manage wisely is a step toward financial independence.</p>
                        </div>
                    </div>
                `
            },
            {
                title: "Living Paycheck to Paycheck",
                content: `
                    <div class="module-section">
                        <h3>Living Paycheck to Paycheck</h3>
                        <p>Living paycheck to paycheck means spending nearly all the money you earn before your next payday arrives. About 61% of Americans report living this way, even among those earning over $100,000 a year. It's a stressful cycle that leaves no room for savings or emergencies.</p>
                        
                        <div class="example-box" style="margin-top: 2rem;">
                            <h4>Why People Fall Into This Trap</h4>
                            <p>The main reason people fall into this habit is not tracking expenses. When you don't know where your money is going, it disappears faster than you think. Small purchases—like daily coffee or app subscriptions—add up quickly.</p>
                        </div>
                        
                        <div class="highlight-box" style="margin-top: 2rem;">
                            <h4>💰 The Solution</h4>
                            <p>The fix is simple but powerful: create a budget that prioritizes saving. Even setting aside just 10% of your income each month can start building momentum. Many people use the 50/30/20 rule—spend 50% on needs, 30% on wants, and save 20%.</p>
                        </div>
                        
                        <div class="quiz-container" style="margin-top: 2rem;">
                            <h4>🚨 Emergency Fund Priority</h4>
                            <p>Building an emergency fund is also key. Start with $500 and aim for at least three months' worth of expenses. This gives you a cushion if you lose your job, face medical bills, or need car repairs.</p>
                        </div>
                        
                        <div class="example-box" style="margin-top: 2rem;">
                            <h4>📊 Shocking Statistic</h4>
                            <p>Most Americans can't cover a $1,000 emergency without borrowing. Breaking that statistic starts with small, consistent savings.</p>
                        </div>
                    </div>
                `
            },
            {
                title: "Impulse Buying and Lifestyle Inflation",
                content: `
                    <div class="module-section">
                        <h3>Impulse Buying and Lifestyle Inflation</h3>
                        <p>Impulse buying happens when you buy something on the spot without planning. It's familiar—especially with how easy online shopping and one-click checkout make spending. Companies are experts at using sales, timers, and ads to make you feel like you'll miss out if you don't buy right now.</p>
                        
                        <div class="example-box" style="margin-top: 2rem;">
                            <h4>What is Lifestyle Inflation?</h4>
                            <p>Lifestyle inflation occurs when your spending increases as your income rises. You get a raise, and suddenly you're upgrading your phone, car, or apartment. While there's nothing wrong with enjoying the rewards of your hard work, lifestyle inflation keeps you from building wealth.</p>
                        </div>
                        
                        <div class="highlight-box" style="margin-top: 2rem;">
                            <h4>🛡️ The Best Defense</h4>
                            <p>The best defense is awareness. Before any purchase, ask: "Do I need this, or do I just want it right now?" If it's not needed, wait 24 hours. Often, the urge disappears.</p>
                        </div>
                        
                        <div class="quiz-container" style="margin-top: 2rem;">
                            <h4>💡 Real Example</h4>
                            <p>If you get a $200 monthly raise and spend it all on eating out, you've gained nothing financially. But if you invested that same $200 each month with an 8% return, you'd have nearly $60,000 after 15 years.</p>
                        </div>
                        
                        <div class="example-box" style="margin-top: 2rem;">
                            <h4>📈 Spending Statistics</h4>
                            <p>The average American spends over $300 a month on impulse purchases. That's nearly $4,000 per year that could go toward investments or debt payoff instead.</p>
                        </div>
                    </div>
                `
            },
            {
                title: "Ignoring Debt",
                content: `
                    <div class="module-section">
                        <h3>Ignoring Debt</h3>
                        <p>Ignoring debt doesn't make it go away—it makes it worse. Missed payments lead to late fees, interest charges, and damage to your credit score. Over time, this makes borrowing more expensive, trapping you in a cycle of debt.</p>
                        
                        <div class="example-box" style="margin-top: 2rem;">
                            <h4>Debt Isn't Always Bad</h4>
                            <p>Debt isn't always bad. A student loan or car loan can be a wise investment if it helps you earn or save more in the long run. But the key is to manage it. Focus on paying off high-interest debt first, especially credit cards.</p>
                        </div>
                        
                        <div class="highlight-box" style="margin-top: 2rem;">
                            <h4>⚠️ Credit Card Reality</h4>
                            <p>The average credit card interest rate in 2024 was over 22%, meaning your balance can double in just a few years if left unpaid.</p>
                        </div>
                        
                        <div class="quiz-container" style="margin-top: 2rem;">
                            <h4>🎯 Debt Snowball Method</h4>
                            <ol>
                                <li><strong>List all your debts</strong> from smallest to largest</li>
                                <li><strong>Pay the minimum</strong> on everything except the smallest one</li>
                                <li><strong>Put extra money</strong> toward that smallest debt until it's gone</li>
                                <li><strong>Move to the next one</strong> and repeat</li>
                            </ol>
                        </div>
                        
                        <div class="example-box" style="margin-top: 2rem;">
                            <h4>💪 Alternative: Debt Avalanche</h4>
                            <p>Another method, the debt avalanche, targets the highest-interest debt first to save the most money overall. The correct method depends on your personality—pick the one that keeps you motivated.</p>
                        </div>
                    </div>
                `
            },
            {
                title: "Not Reading the Fine Print",
                content: `
                    <div class="module-section">
                        <h3>Not Reading the Fine Print</h3>
                        <p>The "fine print" is where companies hide essential details about fees, interest rates, or conditions. Ignoring it can lead to unpleasant surprises, like hidden charges or penalties. Whether you're signing up for a credit card, financing a car, or subscribing to a service, always read the details.</p>
                        
                        <div class="example-box" style="margin-top: 2rem;">
                            <h4>Credit Card Traps</h4>
                            <p>For example, a credit card might offer "0% APR for 12 months," but if you miss one payment, that rate could jump to 25%. Or a car loan could include a long-term clause that makes you pay thousands more in interest.</p>
                        </div>
                        
                        <div class="highlight-box" style="margin-top: 2rem;">
                            <h4>📱 Subscription Services</h4>
                            <p>The same applies to online subscriptions and free trials. Many renew automatically and charge your card if you forget to cancel. Take the time to understand what you're agreeing to—it's your best protection.</p>
                        </div>
                        
                        <div class="quiz-container" style="margin-top: 2rem;">
                            <h4>🔍 What to Look For</h4>
                            <ul>
                                <li>Interest rates and when they change</li>
                                <li>Fees and penalties</li>
                                <li>Auto-renewal policies</li>
                                <li>Cancellation terms</li>
                                <li>Hidden charges</li>
                            </ul>
                        </div>
                    </div>
                `
            },
            {
                title: "How to Build Better Financial Habits",
                content: `
                    <div class="module-section">
                        <h3>How to Build Better Financial Habits</h3>
                        <p>Avoiding mistakes isn't about perfection—it's about consistency. Small, smart actions add up over time. Here are some daily habits that can make a big difference:</p>
                        
                        <div class="highlight-box" style="margin-top: 2rem;">
                            <h4>📱 Daily Money Habits</h4>
                            <ul>
                                <li><strong>Track your spending</strong> with apps like Mint, YNAB, or even your phone's notes app</li>
                                <li><strong>Review your bank statements</strong> monthly to catch subscriptions or unnecessary charges</li>
                                <li><strong>Pay credit card balances</strong> in full whenever possible</li>
                                <li><strong>Automate savings</strong> so a portion of every paycheck is deposited directly into your savings or investment account</li>
                                <li><strong>Continue learning</strong> about money—it's a lifelong skill</li>
                            </ul>
                        </div>
                        
                        <div class="example-box" style="margin-top: 2rem;">
                            <h4>📊 Awareness Power</h4>
                            <p>People who regularly check their bank accounts are 40% less likely to overdraft or miss a payment. Awareness is your best financial tool.</p>
                        </div>
                        
                        <div class="quiz-container" style="margin-top: 2rem;">
                            <h4>🎯 Start Small</h4>
                            <p>Pick one habit to focus on this week. Once it becomes automatic, add another. Small changes compound into big results over time.</p>
                        </div>
                    </div>
                `
            },
            {
                title: "Summary",
                content: `
                    <div class="module-section">
                        <h3>Summary</h3>
                        <p>Most people don't fail financially because they earn too little—they fail because they spend without a plan. Living paycheck to paycheck, giving in to impulse spending, or ignoring debt all create obstacles that compound over time. But by staying aware, budgeting smartly, and reading the fine print, you can avoid the traps that hold others back.</p>
                        
                        <div class="highlight-box" style="margin-top: 2rem;">
                            <h4>🎯 Key Takeaways</h4>
                            <ul>
                                <li><strong>Track your spending</strong> to avoid living paycheck to paycheck</li>
                                <li><strong>Wait 24 hours</strong> before impulse purchases</li>
                                <li><strong>Face debt head-on</strong> with a clear payoff strategy</li>
                                <li><strong>Read the fine print</strong> on all financial agreements</li>
                                <li><strong>Build consistent habits</strong> that protect your money</li>
                            </ul>
                        </div>
                        
                        <div class="example-box" style="margin-top: 2rem;">
                            <h4>💪 Remember</h4>
                            <p>The goal isn't perfection—it's progress. Every dollar you manage wisely is a step toward financial independence.</p>
                        </div>
                    </div>
                `
            },
            {
                title: "Module 9 Quiz",
                content: `
                    <div class="module-section">
                        <h3>Module 9 Quiz: Avoiding Common Financial Mistakes</h3>
                        
                        <h4 style="color: var(--primary-color);">Part A: Multiple Choice (5 questions)</h4>
                        
                        <div class="quiz-question">
                            <strong>Question 1:</strong> What does "living paycheck to paycheck" mean?
                        </div>
                        <div class="quiz-options">
                            <div class="quiz-option">
                                <input type="radio" name="q1" value="A" id="q1a">
                                <label for="q1a">A. Having no savings and spending nearly all your income before the next payday</label>
                            </div>
                            <div class="quiz-option">
                                <input type="radio" name="q1" value="B" id="q1b">
                                <label for="q1b">B. Saving half your paycheck each month</label>
                            </div>
                            <div class="quiz-option">
                                <input type="radio" name="q1" value="C" id="q1c">
                                <label for="q1c">C. Investing all your money in stocks</label>
                            </div>
                            <div class="quiz-option">
                                <input type="radio" name="q1" value="D" id="q1d">
                                <label for="q1d">D. Using only cash for purchases</label>
                            </div>
                        </div>
                        
                        <div class="quiz-question">
                            <strong>Question 2:</strong> What is lifestyle inflation?
                        </div>
                        <div class="quiz-options">
                            <div class="quiz-option">
                                <input type="radio" name="q2" value="A" id="q2a">
                                <label for="q2a">A. When your income increases but your spending stays the same</label>
                            </div>
                            <div class="quiz-option">
                                <input type="radio" name="q2" value="B" id="q2b">
                                <label for="q2b">B. When your expenses grow as your income grows</label>
                            </div>
                            <div class="quiz-option">
                                <input type="radio" name="q2" value="C" id="q2c">
                                <label for="q2c">C. When inflation makes prices rise</label>
                            </div>
                            <div class="quiz-option">
                                <input type="radio" name="q2" value="D" id="q2d">
                                <label for="q2d">D. When your savings increase automatically</label>
                            </div>
                        </div>
                        
                        <div class="quiz-question">
                            <strong>Question 3:</strong> What is the best way to avoid impulse spending?
                        </div>
                        <div class="quiz-options">
                            <div class="quiz-option">
                                <input type="radio" name="q3" value="A" id="q3a">
                                <label for="q3a">A. Buy things only when they're on sale</label>
                            </div>
                            <div class="quiz-option">
                                <input type="radio" name="q3" value="B" id="q3b">
                                <label for="q3b">B. Use credit cards for all purchases</label>
                            </div>
                            <div class="quiz-option">
                                <input type="radio" name="q3" value="C" id="q3c">
                                <label for="q3c">C. Wait 24 hours before buying something non-essential</label>
                            </div>
                            <div class="quiz-option">
                                <input type="radio" name="q3" value="D" id="q3d">
                                <label for="q3d">D. Hide your debit card</label>
                            </div>
                        </div>
                        
                        <div class="quiz-question">
                            <strong>Question 4:</strong> What is the first step in the debt snowball method?
                        </div>
                        <div class="quiz-options">
                            <div class="quiz-option">
                                <input type="radio" name="q4" value="A" id="q4a">
                                <label for="q4a">A. Pay off your most considerable debt first</label>
                            </div>
                            <div class="quiz-option">
                                <input type="radio" name="q4" value="B" id="q4b">
                                <label for="q4b">B. List debts from smallest to largest</label>
                            </div>
                            <div class="quiz-option">
                                <input type="radio" name="q4" value="C" id="q4c">
                                <label for="q4c">C. Stop making payments</label>
                            </div>
                            <div class="quiz-option">
                                <input type="radio" name="q4" value="D" id="q4d">
                                <label for="q4d">D. Apply for more credit</label>
                            </div>
                        </div>
                        
                        <div class="quiz-question">
                            <strong>Question 5:</strong> What can happen if you don't read the fine print on a financial agreement?
                        </div>
                        <div class="quiz-options">
                            <div class="quiz-option">
                                <input type="radio" name="q5" value="A" id="q5a">
                                <label for="q5a">A. You'll earn more rewards</label>
                            </div>
                            <div class="quiz-option">
                                <input type="radio" name="q5" value="B" id="q5b">
                                <label for="q5b">B. You might face unexpected fees or penalties</label>
                            </div>
                            <div class="quiz-option">
                                <input type="radio" name="q5" value="C" id="q5c">
                                <label for="q5c">C. You'll pay less interest</label>
                            </div>
                            <div class="quiz-option">
                                <input type="radio" name="q5" value="D" id="q5d">
                                <label for="q5d">D. It won't affect you at all</label>
                            </div>
                        </div>
                        
                        <h4 style="margin-top: 2rem; color: var(--primary-color);">Part B: True or False (5 questions)</h4>
                        
                        <div class="quiz-question" style="margin-top: 1.5rem;">
                            <strong>Question 6:</strong> Ignoring debt can lead to a lower credit score.
                        </div>
                        <div class="quiz-options">
                            <div class="quiz-option">
                                <input type="radio" name="q6" value="True" id="q6t">
                                <label for="q6t">True</label>
                            </div>
                            <div class="quiz-option">
                                <input type="radio" name="q6" value="False" id="q6f">
                                <label for="q6f">False</label>
                            </div>
                        </div>
                        
                        <div class="quiz-question">
                            <strong>Question 7:</strong> Lifestyle inflation helps you build wealth faster.
                        </div>
                        <div class="quiz-options">
                            <div class="quiz-option">
                                <input type="radio" name="q7" value="True" id="q7t">
                                <label for="q7t">True</label>
                            </div>
                            <div class="quiz-option">
                                <input type="radio" name="q7" value="False" id="q7f">
                                <label for="q7f">False</label>
                            </div>
                        </div>
                        
                        <div class="quiz-question">
                            <strong>Question 8:</strong> Most impulse buying happens because of planned spending.
                        </div>
                        <div class="quiz-options">
                            <div class="quiz-option">
                                <input type="radio" name="q8" value="True" id="q8t">
                                <label for="q8t">True</label>
                            </div>
                            <div class="quiz-option">
                                <input type="radio" name="q8" value="False" id="q8f">
                                <label for="q8f">False</label>
                            </div>
                        </div>
                        
                        <div class="quiz-question">
                            <strong>Question 9:</strong> Reading the fine print helps protect you from hidden fees.
                        </div>
                        <div class="quiz-options">
                            <div class="quiz-option">
                                <input type="radio" name="q9" value="True" id="q9t">
                                <label for="q9t">True</label>
                            </div>
                            <div class="quiz-option">
                                <input type="radio" name="q9" value="False" id="q9f">
                                <label for="q9f">False</label>
                            </div>
                        </div>
                        
                        <div class="quiz-question">
                            <strong>Question 10:</strong> Creating a budget can help you avoid living paycheck to paycheck.
                        </div>
                        <div class="quiz-options">
                            <div class="quiz-option">
                                <input type="radio" name="q10" value="True" id="q10t">
                                <label for="q10t">True</label>
                            </div>
                            <div class="quiz-option">
                                <input type="radio" name="q10" value="False" id="q10f">
                                <label for="q10f">False</label>
                            </div>
                        </div>
                        
                        <button class="btn btn-primary" onclick="checkQuiz(9)" style="margin-top: 2rem;">Check Answers</button>
                        <div id="quiz-results-9"></div>
                    </div>
                `
            }
        ]
    },
    10: {
        title: "Planning for the Future",
        sections: [
            {
                title: "Financial Milestones by Age",
                content: `<div class="module-section"><h3>Age-Based Goals</h3><div class="example-box"><h4>20s:</h4><ul><li>Build emergency fund</li><li>Start retirement savings</li><li>Pay off student loans</li></ul></div><div class="highlight-box"><h4>30s:</h4><ul><li>Buy a home</li><li>Increase retirement contributions</li><li>Build investment portfolio</li></ul></div></div>`
            },
            {
                title: "Planning for Large Expenses",
                content: `<div class="module-section"><h3>Major Purchases</h3><div class="highlight-box"><h4>Education:</h4><p>529 plans, scholarships, grants, work-study programs.</p></div><div class="example-box"><h4>Housing:</h4><p>Save for down payment, closing costs, moving expenses.</p></div></div>`
            },
            {
                title: "Insurance Basics",
                content: `<div class="module-section"><h3>Protecting Yourself</h3><div class="highlight-box"><h4>Essential Insurance:</h4><ul><li><strong>Health:</strong> Covers medical expenses</li><li><strong>Auto:</strong> Required by law</li><li><strong>Renters:</strong> Protects belongings</li><li><strong>Life:</strong> If you have dependents</li></ul></div></div>`
            },
            {
                title: "Wills and Financial Planning",
                content: `<div class="module-section"><h3>Estate Planning</h3><div class="example-box"><h4>Basic Documents:</h4><ul><li>Will</li><li>Power of Attorney</li><li>Healthcare Directive</li><li>Beneficiary Designations</li></ul></div></div>`
            }
        ]
    }
};

// Chatbot API Configuration - DeepHermes 3 + Gemini
const OPENROUTER_API_KEY = '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';
const MODELS = [
    'nousresearch/deephermes-3-llama-3-8b-preview:free',
    'google/gemini-2.0-flash-exp:free'
];

// Chatbot state
let chatHistory = [];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 DOM Content Loaded');
    
    // Retry Supabase initialization if it failed initially
    if (!supabase) {
        console.log('⚠️ Supabase not initialized, retrying...');
        const success = initSupabase();
        if (!success) {
            console.error('❌ Failed to initialize Supabase after retry');
            showNotification('Authentication service unavailable. Please refresh the page.', 'error');
        }
    }
    
    initializeApp();
    setupEventListeners();
    checkAuthState();
    updateProgress();
    initializeChatbot();
});

// Initialize Chatbot
function initializeChatbot() {
    const toggleBtn = document.getElementById('chatbot-toggle');
    const closeBtn = document.getElementById('chatbot-close');
    const chatbotWindow = document.getElementById('chatbot-window');
    const sendBtn = document.getElementById('chatbot-send');
    const inputField = document.getElementById('chatbot-input');
    
    // Toggle chatbot window
    toggleBtn.addEventListener('click', function() {
        chatbotWindow.classList.toggle('active');
    });
    
    // Close chatbot window
    closeBtn.addEventListener('click', function() {
        chatbotWindow.classList.remove('active');
    });
    
    // Send message on button click
    sendBtn.addEventListener('click', function() {
        sendMessage();
    });
    
    // Send message on Enter key
    inputField.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
}

// Check if question is appropriate and finance-related
function isValidFinanceQuestion(msg) {
    const lower = msg.toLowerCase();
    
    // Block inappropriate content
    const inappropriate = ['sex', 'porn', 'drug', 'weapon', 'kill', 'suicide', 'hate', 'racist', 'violence'];
    if (inappropriate.some(word => lower.includes(word))) {
        return false;
    }
    
    // Allow greetings
    const greetings = ['hi', 'hello', 'hey', 'thanks', 'thank you', 'ok', 'okay', 'yes', 'no'];
    if (greetings.some(g => lower === g || lower.startsWith(g + ' '))) {
        return true;
    }
    
    // Block common non-finance topics
    const offTopicWords = [
        'weather', 'sports', 'game', 'movie', 'music', 'food', 'recipe', 'travel',
        'health', 'fitness', 'workout', 'politics', 'religion', 'celebrity', 'entertainment',
        'science', 'history', 'geography', 'animal', 'pet', 'joke', 'story', 'poem',
        'color', 'favorite', 'sport', 'team', 'player', 'actor', 'singer'
    ];
    if (offTopicWords.some(word => lower.includes(word))) {
        return false;
    }
    
    // Finance-related keywords
    const financeWords = [
        'money', 'finance', 'financial', 'budget', 'save', 'saving', 'invest', 'investment',
        'credit', 'debt', 'loan', 'bank', 'tax', 'income', 'expense', 'spend', 'earn',
        'wealth', 'rich', 'poor', 'compound', 'interest', 'retirement', '401k', 'ira',
        'stock', 'bond', 'fund', 'portfolio', 'emergency', 'paycheck', 'salary', 'wage',
        'mortgage', 'rent', 'score', 'card', 'account', 'hustle', 'freelance', 'dividend',
        'finquest', 'module', 'quiz', 'learn', 'course'
    ];
    
    // Check if message contains finance words or is short (likely follow-up)
    if (financeWords.some(word => lower.includes(word)) || msg.split(' ').length <= 3) {
        return true;
    }
    
    return false;
}

// Send message - clean and simple
async function sendMessage() {
    const inputField = document.getElementById('chatbot-input');
    const sendBtn = document.getElementById('chatbot-send');
    const msg = inputField.value.trim();
    
    if (!msg) return;
    
    inputField.value = '';
    
    // Check if question is appropriate
    if (!isValidFinanceQuestion(msg)) {
        addMessage(msg, 'user');
        addMessage("Hey! I'd love to help, but I can only answer questions about financial literacy topics like budgeting, saving, investing, credit, taxes, and money management. Feel free to ask me anything finance-related!", 'bot');
        inputField.focus();
        return;
    }
    
    inputField.disabled = true;
    sendBtn.disabled = true;
    
    addMessage(msg, 'user');
    const loadingId = addLoadingMessage();
    
    // Try models one by one
    for (let i = 0; i < MODELS.length; i++) {
        try {
            const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${OPENROUTER_API_KEY}`
                },
                body: JSON.stringify({
                    model: MODELS[i],
                    messages: [
                        { 
                            role: 'system', 
                            content: `You are the Finquest AI assistant. Finquest is a financial literacy education platform with 10 comprehensive learning modules:

1. Foundations of Financial Literacy - Understanding money, psychology of money, SMART goals
2. Budgeting Basics - Creating budgets, tracking spending, needs vs wants
3. Saving Strategies - Emergency funds, savings goals, compound interest
4. Banking 101 - Choosing banks, account types, fees, online banking
5. Credit and Loans - Understanding credit scores, loans, interest, responsible borrowing
6. Investing Basics - Stocks, bonds, ETFs, retirement accounts, risk vs reward
7. Side Hustles & Income Growth - Multiple income streams, freelancing, monetizing skills
8. Taxes and Legal Basics - How taxes work, filing, W-2 vs 1099, deductions
9. Avoiding Common Financial Mistakes - Living paycheck to paycheck, impulse buying, debt management
10. Planning for the Future - Financial milestones, large expenses, insurance

Answer ONLY financial literacy questions. Keep responses to 2-3 clear sentences. Never use asterisks, markdown, or bullet points. Use plain text only.` 
                        },
                        ...chatHistory,
                        { role: 'user', content: msg }
                    ]
                })
            });
            
            const data = await res.json();
            
            if (res.ok && data.choices?.[0]?.message?.content) {
                let reply = data.choices[0].message.content;
                
                // Remove all asterisks and markdown formatting
                reply = reply.replace(/\*/g, '');
                reply = reply.replace(/#{1,6}\s?/g, '');
                reply = reply.replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1');
                reply = reply.replace(/`([^`]+)`/g, '$1');
                reply = reply.replace(/[-•]\s/g, '');
                reply = reply.replace(/^\d+\.\s/gm, '');
                
                // Limit to 3 sentences
                const sentences = reply.match(/[^.!?]+[.!?]+/g) || [reply];
                if (sentences.length > 3) {
                    reply = sentences.slice(0, 3).join(' ');
                }
                
                reply = reply.trim();
                
                removeLoadingMessage(loadingId);
                addMessage(reply, 'bot');
                
                chatHistory.push({ role: 'user', content: msg });
                chatHistory.push({ role: 'assistant', content: reply });
                
                if (chatHistory.length > 20) chatHistory = chatHistory.slice(-20);
                
                inputField.disabled = false;
                sendBtn.disabled = false;
                inputField.focus();
                return;
            }
        } catch (e) {
            console.log(`Model ${i+1} failed`);
        }
    }
    
    // All failed
    removeLoadingMessage(loadingId);
    addMessage('Unable to connect. Please try again.', 'bot');
    inputField.disabled = false;
    sendBtn.disabled = false;
    inputField.focus();
}

// This function is no longer used - we always get AI responses

// Add message to chat
function addMessage(text, role) {
    const messagesContainer = document.getElementById('chatbot-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `chatbot-message chatbot-${role}`;
    messageDiv.innerHTML = `
        <div class="message-content">
            <p>${escapeHtml(text)}</p>
        </div>
    `;
    messagesContainer.appendChild(messageDiv);
    
    // Scroll to bottom
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Add loading message
function addLoadingMessage() {
    const messagesContainer = document.getElementById('chatbot-messages');
    const loadingDiv = document.createElement('div');
    const loadingId = 'loading_' + Date.now();
    loadingDiv.id = loadingId;
    loadingDiv.className = 'chatbot-message chatbot-bot';
    loadingDiv.innerHTML = `
        <div class="message-content">
            <div class="chatbot-loading">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>
    `;
    messagesContainer.appendChild(loadingDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    return loadingId;
}

// Remove loading message
function removeLoadingMessage(loadingId) {
    const loadingDiv = document.getElementById(loadingId);
    if (loadingDiv) {
        loadingDiv.remove();
    }
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

function initializeApp() {
    // Load saved progress from localStorage
    const savedProgress = localStorage.getItem('finquestProgress');
    if (savedProgress) {
        userProgress = JSON.parse(savedProgress);
    }
    
    // Initialize animations
    initializeAnimations();
    
    // Setup smooth scrolling
    setupSmoothScrolling();
}

function setupEventListeners() {
    // Mobile navigation toggle
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
    }
    
    // Close mobile menu when clicking on links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        });
    });
    
    // Quiz option selection
    document.addEventListener('change', function(e) {
        if (e.target.type === 'radio' && e.target.name.startsWith('q')) {
            const questionNumber = e.target.name.substring(1);
            const options = document.querySelectorAll(`input[name="q${questionNumber}"]`);
            options.forEach(option => {
                option.closest('.quiz-option').classList.remove('selected');
            });
            e.target.closest('.quiz-option').classList.add('selected');
        }
    });
}

function setupSmoothScrolling() {
    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

function initializeAnimations() {
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.module-card, .tool-card, .section-header');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

function scrollToModules() {
    document.getElementById('modules').scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
}

function scrollToTools() {
    document.getElementById('tools').scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
}

function openModule(moduleNumber) {
    // Check if user is logged in
    if (!authState.isAuthenticated) {
        showNotification('Please log in to access course modules', 'info');
        openAuthModal('login');
        return;
    }
    
    currentModule = moduleNumber;
    currentSection = 0;
    
    const modal = document.getElementById('module-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');
    const nextBtn = document.getElementById('next-btn');
    
    if (moduleContent[moduleNumber]) {
        modalTitle.textContent = moduleContent[moduleNumber].title;
        loadModuleSection();
        
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
        
        // Update progress
        userProgress.timeSpent += 5; // Add 5 minutes for starting module
        updateProgress();
    }
}

function loadModuleSection() {
    const modalBody = document.getElementById('modal-body');
    const nextBtn = document.getElementById('next-btn');
    
    if (moduleContent[currentModule] && moduleContent[currentModule].sections[currentSection]) {
        const section = moduleContent[currentModule].sections[currentSection];
        modalBody.innerHTML = section.content;
        
        // Update next button
        if (currentSection < moduleContent[currentModule].sections.length - 1) {
            nextBtn.textContent = 'Next Section';
            nextBtn.style.display = 'inline-flex';
        } else {
            nextBtn.textContent = 'Complete Module';
            nextBtn.style.display = 'inline-flex';
        }
        
        // Add section navigation and update buttons
        addSectionNavigation();
        updateNavigationButtons();
    }
}

function addSectionNavigation() {
    const modalBody = document.getElementById('modal-body');
    const sectionNav = document.createElement('div');
    sectionNav.className = 'section-nav';
    sectionNav.style.cssText = `
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 2rem;
        padding: 1.5rem;
        background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
        border-radius: 12px;
        border-left: 4px solid var(--primary-color);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    `;
    
    const currentSectionTitle = moduleContent[currentModule].sections[currentSection].title;
    const totalSections = moduleContent[currentModule].sections.length;
    
    sectionNav.innerHTML = `
        <div>
            <div style="font-size: 0.75rem; font-weight: 600; color: var(--primary-color); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 0.25rem;">Section ${currentSection + 1} of ${totalSections}</div>
            <div style="color: var(--text-primary); font-size: 1.125rem; font-weight: 600;">${currentSectionTitle}</div>
        </div>
    `;
    
    modalBody.insertBefore(sectionNav, modalBody.firstChild);
}

function updateNavigationButtons() {
    const nextBtn = document.getElementById('next-btn');
    const backBtn = document.getElementById('back-btn');
    const totalSections = moduleContent[currentModule].sections.length;
    
    // Show/hide Back button based on section
    if (currentSection === 0) {
        backBtn.style.display = 'none';
    } else {
        backBtn.style.display = 'inline-flex';
        backBtn.title = 'Go back to the previous section';
    }
    
    // Update Next button text, style, and tooltip based on section
    if (currentSection === totalSections - 1) {
        nextBtn.innerHTML = '<i class="fas fa-check-circle"></i> Complete Module';
        nextBtn.title = 'Mark this module as complete and save your progress';
        nextBtn.classList.remove('btn-primary');
        nextBtn.classList.add('btn-success');
    } else {
        nextBtn.innerHTML = 'Next Section <i class="fas fa-arrow-right"></i>';
        nextBtn.title = 'Continue to the next section';
        nextBtn.classList.remove('btn-success');
        nextBtn.classList.add('btn-primary');
    }
}

function nextSection() {
    if (currentSection < moduleContent[currentModule].sections.length - 1) {
        currentSection++;
        loadModuleSection();
        
        // Scroll to top of modal body
        const modalBody = document.getElementById('modal-body');
        if (modalBody) {
            modalBody.scrollTop = 0;
        }
    } else {
        completeModule();
    }
}

function previousSection() {
    if (currentSection > 0) {
        currentSection--;
        loadModuleSection();
        
        // Scroll to top of modal body
        const modalBody = document.getElementById('modal-body');
        if (modalBody) {
            modalBody.scrollTop = 0;
        }
    }
}

function completeModule() {
    if (!userProgress.completedModules.includes(currentModule)) {
        userProgress.completedModules.push(currentModule);
        userProgress.modulesCompleted++;
    }
    
    // Update streak
    const today = new Date().toDateString();
    if (userProgress.lastActiveDate !== today) {
        userProgress.streak++;
        userProgress.lastActiveDate = today;
    }
    
    // Save progress
    saveUserProgress();
    
    // Close modal
    closeModule();
    
    // Show completion message
    showNotification('Module completed! Great job! 🎉', 'success');
    
    // Update progress display
    updateProgress();
}

function closeModule() {
    const modal = document.getElementById('module-modal');
    modal.classList.remove('show');
    document.body.style.overflow = 'auto';
}

function checkQuiz(moduleNumber) {
    const answers = {
        1: { 1: 'B', 2: 'C', 3: 'C', 4: 'B', 5: 'False', 6: 'True', 7: 'True' },
        2: { 1: 'C', 2: 'B', 3: 'D', 4: 'C', 5: 'C', 6: 'False', 7: 'True', 8: 'False', 9: 'True', 10: 'True' },
        3: { 1: 'B', 2: 'D', 3: 'B', 4: 'C', 5: 'B', 6: 'False', 7: 'True', 8: 'False', 9: 'True', 10: 'True' },
        4: { 1: 'C', 2: 'C', 3: 'C', 4: 'C', 5: 'C', 6: 'True', 7: 'False', 8: 'True', 9: 'False', 10: 'True' },
        5: { 1: 'B', 2: 'C', 3: 'C', 4: 'B', 5: 'C', 6: 'True', 7: 'True', 8: 'False', 9: 'False', 10: 'True' },
        6: { 1: 'B', 2: 'B', 3: 'B', 4: 'C', 5: 'C', 6: 'False', 7: 'True', 8: 'True', 9: 'False', 10: 'True' },
        7: { 1: 'B', 2: 'B', 3: 'C', 4: 'C', 5: 'B', 6: 'False', 7: 'True', 8: 'False', 9: 'True', 10: 'True' },
        8: { 1: 'A', 2: 'C', 3: 'B', 4: 'C', 5: 'C', 6: 'False', 7: 'False', 8: 'True', 9: 'True', 10: 'False' },
        9: { 1: 'A', 2: 'B', 3: 'C', 4: 'B', 5: 'B', 6: 'True', 7: 'False', 8: 'False', 9: 'True', 10: 'True' }
    };
    
    const userAnswers = {};
    const questions = document.querySelectorAll(`input[name^="q"]`);
    
    questions.forEach(input => {
        if (input.checked) {
            const questionNum = parseInt(input.name.substring(1));
            userAnswers[questionNum] = input.value;
        }
    });
    
    let correct = 0;
    let total = Object.keys(answers[moduleNumber]).length;
    
    Object.keys(answers[moduleNumber]).forEach(questionNum => {
        if (userAnswers[questionNum] === answers[moduleNumber][questionNum]) {
            correct++;
        }
    });
    
    const resultsDiv = document.getElementById(`quiz-results-${moduleNumber}`);
    const percentage = Math.round((correct / total) * 100);
    
    // Set passing score based on module (70% passing grade)
    let passingScore = 3; // default
    if (moduleNumber === 1) passingScore = 5;
    else if (moduleNumber === 2) passingScore = 7;
    else if (moduleNumber === 3) passingScore = 7;
    else if (total >= 10) passingScore = 7; // For other modules with 10 questions
    const isPassing = correct >= passingScore;
    
    // Generate detailed feedback for each question
    let feedbackHTML = '';
    Object.keys(answers[moduleNumber]).forEach(questionNum => {
        const correctAnswer = answers[moduleNumber][questionNum];
        const userAnswer = userAnswers[questionNum];
        const isCorrect = userAnswer === correctAnswer;
        
        const explanations = getQuizExplanations(moduleNumber, questionNum, userAnswer, correctAnswer);
        
        if (isCorrect) {
            feedbackHTML += `
                <div class="question-feedback correct-answer">
                    <div class="feedback-header">
                        <svg class="feedback-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path d="M16.667 5L7.5 14.167 3.333 10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        <span class="feedback-label">Question ${questionNum} - Correct!</span>
                    </div>
                    <div class="answer-display correct-display">
                        <strong>✓ Your Answer: ${userAnswer}</strong>
                    </div>
                    <p class="feedback-text">${explanations.correct}</p>
                </div>
            `;
        } else {
            feedbackHTML += `
                <div class="question-feedback incorrect-answer">
                    <div class="feedback-header">
                        <svg class="feedback-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path d="M15 5L5 15M5 5l10 10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        <span class="feedback-label">Question ${questionNum} - Review Needed</span>
                    </div>
                    <div class="answer-display wrong-display">
                        <strong>✗ Your Answer: ${userAnswer || 'Not answered'}</strong>
                    </div>
                    <p class="feedback-explain-wrong"><strong>Why this is wrong:</strong> ${explanations.wrong}</p>
                    <div class="answer-display correct-display">
                        <strong>✓ Correct Answer: ${correctAnswer}</strong>
                    </div>
                    <p class="feedback-explain-right"><strong>Why this is correct:</strong> ${explanations.correct}</p>
                </div>
            `;
        }
    });
    
    resultsDiv.innerHTML = `
        <div class="quiz-results-summary ${isPassing ? 'passed' : 'failed'}">
            <div class="quiz-score-circle">
                <div class="score-number">${correct}/${total}</div>
                <div class="score-percentage">${percentage}%</div>
            </div>
            <h3 class="quiz-status">${isPassing ? '🎉 Great Job!' : '📚 Keep Learning'}</h3>
            <p class="quiz-message">${isPassing ? 'You\'ve mastered this module!' : 'Review the feedback below to improve.'}</p>
        </div>
        <div class="quiz-feedback-container">
            <h4 class="feedback-title">📝 Question Feedback</h4>
            ${feedbackHTML}
        </div>
    `;
    
    if (isPassing) {
        userProgress.quizzesPassed++;
        
        // Mark quiz as completed for this module
        if (!userProgress.quizzesCompleted.includes(moduleNumber)) {
            userProgress.quizzesCompleted.push(moduleNumber);
        }
        
        // Mark module as completed if not already completed
        if (!userProgress.completedModules.includes(moduleNumber)) {
            userProgress.completedModules.push(moduleNumber);
            userProgress.modulesCompleted++;
        }
        
        updateProgress();
        saveUserProgress();
    }
}

function getQuizExplanations(moduleNumber, questionNum, userAnswer, correctAnswer) {
    // Detailed explanations for each quiz question with specific wrong answer feedback
    const explanations = {
        1: {
            1: { 
                correct: "Financial literacy is all about developing the knowledge and skills to budget and manage your money effectively, giving you control over your financial future.",
                wrong: {
                    'A': "Spending money on luxury items is actually the opposite of financial literacy—it's about managing resources wisely, not just spending on wants.",
                    'C': "While managing debt is important, financial literacy isn't about avoiding ALL debt permanently. Some debt (like mortgages or student loans) can be strategic when managed properly.",
                    'D': "Making friends has nothing to do with financial literacy—this is about money management skills, not social relationships."
                }
            },
            2: { 
                correct: "Uber Eats delivery is a convenience service, not a necessity for survival. While food is a need, having it delivered to you is a want that adds extra cost.",
                wrong: {
                    'A': "Groceries are a fundamental need—you need food to survive. This is essential spending, not optional.",
                    'B': "Rent is a critical need because you need shelter to live safely. Housing is one of the most basic human needs.",
                    'D': "Utility bills (electricity, water, heating) are needs because they keep your home functional and livable. You can't live safely without utilities."
                }
            },
            3: { 
                correct: "Flexible is NOT part of SMART goals. The acronym stands for Specific, Measurable, Achievable, Relevant, and Time-bound. Goals should be structured, not flexible.",
                wrong: {
                    'A': "Measurable IS part of SMART—you need to be able to track and measure your progress toward your goal.",
                    'B': "Achievable IS part of SMART—your goals need to be realistic and within your reach to stay motivated.",
                    'D': "Time-bound IS part of SMART—you need a deadline to create urgency and track whether you achieved your goal."
                }
            },
            4: { 
                correct: "Both of these are active income because Alex has to actively work and trade time for money—whether at the marketing job or driving for Uber.",
                wrong: {
                    'A': "Passive income means earning money without active daily work (like rental properties or dividends). Alex has to actively drive and work at a job for both income sources.",
                    'C': "Investment income comes from investments like stocks, bonds, or real estate. Alex is earning money through labor, not from investments growing in value.",
                    'D': "Bonus income is a one-time extra payment from an employer. Alex's Uber earnings are regular supplementary income, not occasional bonuses."
                }
            },
            5: { 
                correct: "This is FALSE because money decisions are heavily influenced by emotions, psychology, cognitive biases, and social pressures—not just pure logic.",
                wrong: {
                    'True': "If this were true, no one would impulse buy, overspend, or make emotional purchases. Research shows emotions heavily influence financial decisions—people often buy based on feelings, not just logic."
                }
            },
            6: { 
                correct: "This is TRUE. Lifestyle inflation is when people increase their spending as their income grows, upgrading their lifestyle instead of saving more money.",
                wrong: {
                    'False': "This statement is actually true. Lifestyle inflation is a real phenomenon where people spend more when they earn more—like buying a luxury car after a raise instead of saving the extra income."
                }
            },
            7: { 
                correct: "This is TRUE. Dividends (from stocks) and royalties (from creative work) are passive income because you earn money without actively working for it daily.",
                wrong: {
                    'False': "This is actually true. Once established, dividends and royalties generate income without requiring daily active work—that's the definition of passive income."
                }
            }
        },
        5: {
            1: { 
                correct: "Credit is the ability to borrow money now with the promise to pay it back later, often with interest. It's a trust-based lending system.",
                wrong: {
                    'A': "A credit score is a NUMBER that represents your creditworthiness, not the definition of credit itself. Credit is the ability to borrow money.",
                    'C': "A savings account is where you deposit YOUR OWN money to save it. Credit is about borrowing SOMEONE ELSE'S money.",
                    'D': "Cash is physical money you own. Credit is the opposite—it's money you don't have yet but can borrow."
                }
            },
            2: { 
                correct: "APR stands for Annual Percentage Rate—it represents the yearly cost of borrowing money, including interest and fees.",
                wrong: {
                    'A': "Annual Payment Rate isn't a real financial term. APR specifically refers to the percentage (rate) of interest, not just payments.",
                    'B': "Annual Payment Required isn't what APR means. APR is about the interest RATE you're charged, not the payment amount.",
                    'D': "Annual Premium Rate is insurance terminology, not credit terminology. APR is specifically about borrowing costs."
                }
            },
            3: { 
                correct: "Auto loans are installment loans because you borrow a fixed amount and repay it in equal monthly installments over a set period (like 3-5 years).",
                wrong: {
                    'A': "Payday loans are short-term, high-interest loans meant to be repaid with your next paycheck. Auto loans are long-term structured loans.",
                    'B': "Revolving credit (like credit cards) lets you borrow repeatedly up to a limit. Auto loans are one-time borrowing with fixed monthly payments.",
                    'D': "Personal loans can be used for anything. While an auto loan is technically a type of personal loan, it's specifically classified as an installment loan due to its repayment structure."
                }
            },
            4: { 
                correct: "Payment history is the most important factor (35% of your score) because it shows lenders if you're reliable and trustworthy at paying back debt on time.",
                wrong: {
                    'A': "Credit card design has zero impact on your credit score. Your score is based on financial behavior, not aesthetics.",
                    'C': "Annual income doesn't directly affect your credit score. Credit scores measure how you manage debt, not how much money you make.",
                    'D': "The number of bank accounts you have isn't reported to credit bureaus and doesn't affect your credit score at all."
                }
            },
            5: { 
                correct: "Sophie's utilization is 80% because the formula is: (Amount Owed ÷ Credit Limit) × 100 = ($800 ÷ $1,000) × 100 = 80%.",
                wrong: {
                    'A': "40% would be if she only owed $400. But she owes $800 on a $1,000 limit, which is 80%.",
                    'B': "8% would be if she owed only $80. She actually owes $800, which is 10 times more.",
                    'D': "800% is mathematically impossible for credit utilization—you can't owe more than your limit (that would be over 100%). The correct calculation is $800/$1,000 = 0.80 = 80%."
                }
            },
            6: { 
                correct: "This is TRUE. Being an authorized user on someone else's credit card (like a parent's) lets you build credit history even before you're old enough to get your own card.",
                wrong: {
                    'False': "This is actually true. Authorized users benefit from the account holder's payment history, allowing minors to start building credit early."
                }
            },
            7: { 
                correct: "This is TRUE. In 2024, the average credit card APR exceeded 20% due to the Federal Reserve raising interest rates to combat inflation.",
                wrong: {
                    'False': "This is actually true. Credit card rates in 2024 reached historic highs, with many cards charging over 20% APR due to Federal Reserve rate hikes."
                }
            },
            8: { 
                correct: "This is FALSE. Even if you pay in full each month, maxing out your cards shows 100% utilization when lenders check, which significantly hurts your credit score.",
                wrong: {
                    'True': "This is false because credit utilization is calculated based on your balance when lenders report it (usually at statement close). Even if you pay it off later, high utilization still damages your score."
                }
            },
            9: { 
                correct: "This is FALSE. Debt is money you OWE (outstanding balances). Credit is your ABILITY to borrow and your history of repayment. They're related but distinct concepts.",
                wrong: {
                    'True': "This is false because debt and credit are different. Debt = money you currently owe. Credit = your borrowing ability and trustworthiness. You can have good credit with zero debt."
                }
            },
            10: { 
                correct: "This is TRUE. Paying more than the minimum reduces your principal balance faster, which means less interest accumulates over time, saving you significant money.",
                wrong: {
                    'False': "This is actually true. When you pay extra, that money goes directly to reducing your principal. Less principal means less interest charged, which saves you money long-term."
                }
            }
        },
        2: {
            1: {
                correct: "A budget's main purpose is to plan and control where your money goes each month, helping you prioritize spending and reach your financial goals.",
                wrong: {
                    'A': "Your credit score is tracked separately by credit bureaus, not managed through budgeting. Budgeting is about planning spending.",
                    'B': "Budgeting doesn't mean never spending—it's about spending wisely on what matters most to you.",
                    'D': "Budgeting actually helps you REDUCE unnecessary spending, which can lower your tax liability, not increase it."
                }
            },
            2: {
                correct: "The 50/30/20 rule is a popular budgeting method that divides income: 50% needs, 30% wants, and 20% savings/debt payoff.",
                wrong: {
                    'A': "The '100/0 rule' isn't a real budgeting method—you can't allocate 100% of income without accounting for spending.",
                    'C': "The 'paycheck gamble' method isn't a real budgeting approach. Real budgeting involves planning, not gambling with money.",
                    'D': "The 'credit-over-cash rule' doesn't exist as a budgeting method. It's best to budget and save cash."
                }
            },
            3: {
                correct: "In zero-based budgeting, every dollar is assigned a purpose, so income minus expenses equals exactly $0—meaning you've allocated every penny.",
                wrong: {
                    'A': "$100 left over means you didn't give that money a job in zero-based budgeting—every dollar must be assigned.",
                    'B': "Leaving $50 unallocated violates the principle of zero-based budgeting, where every dollar has a purpose.",
                    'C': "Your savings goal would be listed as a separate expense, not the remainder. The whole point is that the remainder is $0 after allocating everything."
                }
            },
            4: {
                correct: "Netflix and eating out are wants—optional entertainment and convenience that you can live without.",
                wrong: {
                    'A': "These are wants, not needs. Needs are essentials like food, shelter, and basic utilities.",
                    'B': "Emergency funds are for unexpected crises, not routine entertainment expenses like Netflix or dining out.",
                    'D': "Utilities are needs (electricity, water). Netflix and restaurants are entertainment/discretionary spending (wants)."
                }
            },
            5: {
                correct: "The most common reason people fail at budgeting is they don't track their spending, so they don't know where their money actually goes.",
                wrong: {
                    'A': "Earning more money doesn't cause budget failure—in fact, more income makes budgeting easier if you plan properly.",
                    'B': "Creating impossible-to-reach budgets sets you up for failure. The issue is usually poor tracking, not unrealistic goals alone.",
                    'C': "Budgeting is designed to help you stick to your goals, not prevent it—the problem is typically lack of monitoring spending."
                }
            },
            6: {
                correct: "This is FALSE. An emergency fund should be 3-6 months of expenses, not 1 month of income (which varies).",
                wrong: {
                    'True': "Actually false. Emergency funds should cover 3-6 months of expenses, not one month of income. Income and expenses are different amounts."
                }
            },
            7: {
                correct: "This is TRUE. Needs are required for survival (food, shelter, utilities) while wants are optional (Netflix, eating out).",
                wrong: {
                    'False': "Actually true. Needs are necessities for survival. Wants are things you desire but can live without."
                }
            },
            8: {
                correct: "This is FALSE. Reviewing and adjusting your budget regularly (monthly) helps you stay on track and adapt to changes.",
                wrong: {
                    'True': "Actually false. Set-it-and-forget-it budgets don't work—you need to review monthly to ensure it still fits your life."
                }
            },
            9: {
                correct: "This is TRUE. Tracking every expense helps you see where money really goes versus where you THINK it goes.",
                wrong: {
                    'False': "Actually true. Tracking expenses reveals spending habits and helps you stick to your budget plan."
                }
            },
            10: {
                correct: "This is TRUE. Living paycheck to paycheck means spending all income with no savings buffer, leaving no emergency safety net.",
                wrong: {
                    'False': "Actually true. Living paycheck to paycheck means no savings, leaving you vulnerable to financial emergencies."
                }
            }
        },
        3: {
            1: {
                correct: "To save 50% of your income ($1,000 × 0.50 = $500), you'd need to cut expenses and increase income until you're putting away $500 monthly.",
                wrong: {
                    'A': "100% savings is impossible—you need to pay for housing, food, and basic necessities.",
                    'C': "25% ($250) is a good goal but doesn't meet the 50% target specified in the question.",
                    'D': "10% ($100) is too low—you'd need to dramatically increase your savings rate to hit $500/month."
                }
            },
            2: {
                correct: "The 52-week challenge saves exactly $1,378 by adding $52 in week 1, $51 in week 2, etc. (52+51+50+...=1,378).",
                wrong: {
                    'A': "$500 is far too low. The full challenge requires $52+$51+$50+... which totals $1,378.",
                    'B': "$1,000 is close but not accurate. The formula (52×53)/2 = 1,378 gives the exact total.",
                    'C': "$1,200 is close but not the correct sum. You need to calculate: 52+51+50+...+1 = 1,378."
                }
            },
            3: {
                correct: "Compound interest earns interest on your principal AND previously earned interest, making your savings grow exponentially over time.",
                wrong: {
                    'A': "Only earning on your principal would be simple interest, not compound. The magic is earning interest on interest.",
                    'B': "Earning only on what you deposit is simple interest. Compound means it grows on all accumulated value.",
                    'D': "Compound interest isn't just about avoiding fees—it's about earning returns on your returns over time."
                }
            },
            4: {
                correct: "An emergency fund should cover 3-6 months of basic expenses, giving you a buffer if you lose income or face unexpected costs.",
                wrong: {
                    'A': "One month is too short—jobs can take 3-6 months to find, and car repairs, medical bills, etc. can happen anytime.",
                    'B': "One week is far too little—a single unexpected expense could wipe this out immediately.",
                    'D': "While 12 months sounds safe, it's excessive and that money could be earning more elsewhere. 3-6 months is the sweet spot."
                }
            },
            5: {
                correct: "Automating savings removes the temptation to spend—the money moves before you even see it in your checking account.",
                wrong: {
                    'A': "Automation doesn't prevent touching the money—it's about making saving effortless by timing it before you spend.",
                    'B': "Interest rates aren't the issue—automation works because it happens BEFORE you can spend the money.",
                    'D': "Automation isn't really for organization—it's about building the habit without willpower by making it automatic."
                }
            },
            6: {
                correct: "This is FALSE. High yield savings accounts are insured by the FDIC up to $250,000 and are very safe.",
                wrong: {
                    'True': "Actually false. FDIC insurance makes high-yield savings accounts just as safe as regular savings accounts."
                }
            },
            7: {
                correct: "This is TRUE. CDs offer higher interest rates in exchange for locking your money away for a set period without early withdrawals.",
                wrong: {
                    'False': "Actually true. The trade-off is higher rates for less flexibility due to the commitment period."
                }
            },
            8: {
                correct: "This is FALSE. Having an emergency fund prevents you from needing to rely on expensive credit cards for unexpected expenses.",
                wrong: {
                    'True': "Actually false. Emergency funds are a defensive tool that REDUCE your need for expensive borrowing."
                }
            },
            9: {
                correct: "This is TRUE. An emergency fund provides peace of mind and financial security, reducing stress about unexpected expenses.",
                wrong: {
                    'False': "Actually true. Knowing you have a financial cushion reduces anxiety and gives you confidence to handle surprises."
                }
            },
            10: {
                correct: "This is TRUE. Even small, automatic transfers add up over time through consistency and compound interest.",
                wrong: {
                    'False': "Actually true. $10/month is $120/year, and with interest, even small amounts compound significantly over years."
                }
            }
        },
        4: {
            1: {
                correct: "Compound interest means you earn interest on your original deposit PLUS all the interest you've already earned—so it grows exponentially.",
                wrong: {
                    'A': "Simple interest only earns on the original deposit—no exponential growth. Compound earns on everything.",
                    'B': "Interest rates aren't determined by deposits. Compound interest is about HOW often interest is calculated, not where it goes.",
                    'D': "Compounding has nothing to do with tax rates—it's about earning returns on your returns."
                }
            },
            2: {
                correct: "Your investment would be worth $10,816.65. Starting with $10,000 at 8% for 1 year: $10,000 × 1.08 = $10,800.",
                wrong: {
                    'A': "$10,080 is close but not precise—the calculation includes quarterly compounding which makes it $10,816.65.",
                    'B': "$10,800 is simple interest for one year, but with quarterly compounding you get slightly more: $10,816.65.",
                    'D': "$12,000 would require 20% returns. At 8% for 1 year, you'd have around $10,800-10,816."
                }
            },
            3: {
                correct: "401(k)s have contribution limits that cap how much you can invest each year ($23,000 in 2024 for those under 50).",
                wrong: {
                    'A': "You CAN contribute monthly—many people do through payroll deductions. The issue is the annual cap.",
                    'B': "401(k)s DO offer tax benefits—contributions are pre-tax, reducing your taxable income.",
                    'D': "Matching isn't a limit—employer matching is a bonus! The actual limit is IRS contribution caps."
                }
            },
            4: {
                correct: "Dollar-cost averaging reduces timing risk by investing fixed amounts regularly, buying more when prices are low and less when high.",
                wrong: {
                    'A': "It doesn't guarantee gains—you can still lose money. It just reduces the risk of buying everything at a market peak.",
                    'B': "It actually SMOOTHS out returns by buying at various price levels over time, reducing volatility.",
                    'D': "It doesn't eliminate all investment risk—you could still face losses. It just reduces the risk of poor timing."
                }
            },
            5: {
                correct: "ROI (Return on Investment) measures how much profit you made compared to what you invested: (Gain - Cost) / Cost × 100.",
                wrong: {
                    'A': "Interest rate tells you the annual rate paid on bonds/loans, not your total profit on an investment.",
                    'B': "Diversification is about spreading risk across assets, not measuring returns on investments.",
                    'D': "The Dow Jones is a stock index, not a metric for calculating your individual investment performance."
                }
            },
            6: {
                correct: "This is TRUE. A low expense ratio means more of your money goes to investments rather than fees.",
                wrong: {
                    'False': "Actually true. Higher expense ratios eat into your returns—lower is better for your wallet."
                }
            },
            7: {
                correct: "This is FALSE. Buying individual stocks is MORE risky than mutual funds, which diversify across many companies.",
                wrong: {
                    'True': "Actually false. Diversification in mutual funds reduces risk compared to betting on individual companies."
                }
            },
            8: {
                correct: "This is TRUE. Index funds mirror the overall market with low fees, making them a solid foundation for beginners.",
                wrong: {
                    'False': "Actually true. Index funds are ideal starter investments due to their simplicity, diversification, and low costs."
                }
            },
            9: {
                correct: "This is FALSE. Starting early lets compound interest work in your favor, so you need to save LESS per month to reach goals.",
                wrong: {
                    'True': "Actually false. Time is your friend—starting early means smaller monthly contributions are needed due to compound growth."
                }
            },
            10: {
                correct: "This is TRUE. Rebalancing ensures your portfolio doesn't drift too far from your target asset allocation.",
                wrong: {
                    'False': "Actually true. Rebalancing maintains your desired risk level and prevents over-concentration in one asset class."
                }
            }
        },
        6: {
            1: {
                correct: "The main purpose of insurance is to protect you from financial devastation by transferring risk to an insurance company for a fee.",
                wrong: {
                    'A': "Investing is separate from insurance—insurance protects what you have, investing grows your wealth.",
                    'B': "Insurance provides financial protection, not fun or entertainment. It's about managing risk.",
                    'C': "Insurance doesn't make you money—it costs money. The value is protection against large losses."
                }
            },
            2: {
                correct: "The premium is the monthly or annual fee you pay to keep your insurance policy active and maintain coverage.",
                wrong: {
                    'A': "Deductible is what you pay OUT OF POCKET before insurance kicks in. Premium is what you pay to maintain coverage.",
                    'C': "Coverage limit is the maximum the insurer pays. Premium is what YOU pay to maintain that coverage.",
                    'D': "Co-pay is what you pay for a specific service. Premium is the ongoing fee to keep the policy active."
                }
            },
            3: {
                correct: "Health insurance protects you from costly medical bills, which can bankrupt individuals without coverage.",
                wrong: {
                    'A': "Car insurance is important but health emergencies are FAR more expensive—a hospital stay can cost hundreds of thousands.",
                    'C': "Travel insurance is niche protection. Health insurance is essential—medical costs are a leading cause of bankruptcy.",
                    'D': "Pet insurance is nice to have, but human health costs are exponentially higher and more critical."
                }
            },
            4: {
                correct: "A $500 deductible means you pay the first $500 of a claim, and insurance covers the rest (up to your policy limit).",
                wrong: {
                    'A': "$5,000 is much too high—a $500 deductible means you only pay $500 before insurance covers the rest.",
                    'B': "$500 monthly premium is different. A $500 deductible is a ONE-TIME amount per claim event.",
                    'C': "$500 limit is too small—that would barely cover anything. The deductible is just your out-of-pocket share."
                }
            },
            5: {
                correct: "You'd spend $600 total: $400 premiums + $200 deductible = $600 out of pocket (insurance pays the remaining $400).",
                wrong: {
                    'A': "$800 is incorrect. You pay $400 premiums + $200 deductible = $600 (insurance covers the rest).",
                    'B': "$1,000 would be if you had no insurance—with insurance, you only pay $600 (premium + deductible).",
                    'C': "$1,200 is wrong. You don't pay the full bill when insured—just your $200 deductible portion."
                }
            },
            6: {
                correct: "This is FALSE. Health insurance is crucial—medical costs can bankrupt you, and you can't predict when you'll need it.",
                wrong: {
                    'True': "Actually false. Even young, healthy people face accidents, injuries, or unexpected illnesses that require costly medical care."
                }
            },
            7: {
                correct: "This is TRUE. Term life insurance provides coverage for a specific period (like 20 years) at affordable rates.",
                wrong: {
                    'False': "Actually true. Term life insurance covers you for a set term, making it cheaper than whole life policies."
                }
            },
            8: {
                correct: "This is TRUE. Bundling home and auto insurance often gives you discounts from the same company.",
                wrong: {
                    'False': "Actually true. Insurance companies offer multi-policy discounts when you combine home and auto coverage."
                }
            },
            9: {
                correct: "This is FALSE. Renter's insurance is very affordable (often $15-30/month) and protects your belongings and liability.",
                wrong: {
                    'True': "Actually false. Renter's insurance is inexpensive and well worth it for protection against theft, fire, and liability claims."
                }
            },
            10: {
                correct: "This is TRUE. Life insurance is crucial for parents—it provides financial security for your children if you pass away.",
                wrong: {
                    'False': "Actually true. Life insurance ensures your children are financially protected if the worst happens—critical for parents."
                }
            }
        },
        7: {
            1: {
                correct: "A W-2 shows wages and taxes withheld from a job. A 1099 shows income received as an independent contractor without tax withholding.",
                wrong: {
                    'A': "Both are tax forms, not financial instruments. They report income differently to the IRS.",
                    'C': "Both show income amounts, not loan documents. They're forms from employers/clients to report earnings.",
                    'D': "1099 isn't for charitable donations—that's 1098. 1099 is for contract work income."
                }
            },
            2: {
                correct: "The standard deduction is a set amount that reduces your taxable income without needing to itemize expenses.",
                wrong: {
                    'A': "The deduction AMOUNT varies by filing status (single, married, etc.), but it's not calculated individually.",
                    'B': "It's not based on your income percent—it's a fixed dollar amount determined by your filing status.",
                    'D': "State taxes are separate. The standard deduction is a federal tax benefit based on your marital status."
                }
            },
            3: {
                correct: "Filing single is for unmarried individuals. Filing married/joint is for couples combining income and deductions together.",
                wrong: {
                    'A': "Both are for individuals, but married couples can file separately if desired for strategic reasons.",
                    'B': "Single filers don't get better rates across the board—tax rates are progressive regardless of marital status.",
                    'C': "No age requirement for filing status—it's about marital status, not age brackets."
                }
            },
            4: {
                correct: "You can deduct up to $3,000 in investment losses from your ordinary income each year, reducing your overall tax bill.",
                wrong: {
                    'A': "$1,000 is too low—the IRS allows up to $3,000 in capital loss deductions per year.",
                    'C': "$5,000 is higher than allowed. The annual limit is $3,000 for capital loss deductions against ordinary income.",
                    'D': "You can't deduct the full amount without limit. The IRS caps capital loss deductions at $3,000 per year."
                }
            },
            5: {
                correct: "A tax refund means you overpaid during the year, essentially giving the government an interest-free loan.",
                wrong: {
                    'A': "Refunds aren't bonuses—they're your own money being returned that you overpaid.",
                    'C': "Refunds come because you paid too much throughout the year. You want to get as close to $0 owed or refunded as possible.",
                    'D': "Refunds happen when you PAY TOO MUCH during the year, not when you haven't paid taxes."
                }
            },
            6: {
                correct: "This is FALSE. Tax-advantaged accounts like 401(k)s and IRAs offer pre-tax contributions, lowering your current year's taxes.",
                wrong: {
                    'True': "Actually false. Contributing to retirement accounts reduces your taxable income NOW, so you pay less in current taxes."
                }
            },
            7: {
                correct: "This is TRUE. Charitable donations to qualified nonprofits are tax-deductible if you itemize your deductions.",
                wrong: {
                    'False': "Actually true. Keep receipts for charitable giving—you can deduct these amounts when itemizing deductions."
                }
            },
            8: {
                correct: "This is FALSE. You can file your own taxes or use software. CPAs and tax professionals are helpful but not required.",
                wrong: {
                    'True': "Actually false. Many people file their own taxes successfully using software or paper forms."
                }
            },
            9: {
                correct: "This is TRUE. Filing electronically is faster, more secure, and results in quicker refunds than paper filing.",
                wrong: {
                    'False': "Actually true. E-filing is faster, safer, and delivers refunds weeks sooner than paper filing."
                }
            },
            10: {
                correct: "This is TRUE. You can contribute to a traditional IRA until April 15th of the following year and still deduct it on your previous year's taxes.",
                wrong: {
                    'False': "Actually true. The IRS gives you until April 15th (tax deadline) to make prior-year IRA contributions."
                }
            }
        },
        8: {
            1: {
                correct: "Financial independence means having enough passive income from investments to cover all living expenses without needing to work.",
                wrong: {
                    'A': "Being debt-free is great but not enough—you need income to live on without working.",
                    'B': "Having multiple jobs is the opposite of independence—you're still trading time for money.",
                    'D': "Maxing out credit isn't independence—that's being in debt, which makes you dependent on lenders."
                }
            },
            2: {
                correct: "The 4% rule suggests withdrawing 4% of your retirement portfolio annually, which should last 30+ years with proper investing.",
                wrong: {
                    'A': "20 years is too short. The 4% rule is designed to last longer through strategic withdrawals and growth.",
                    'C': "50 years is unlikely without being very conservative. The 4% rule targets 30+ years.",
                    'D': "Forever requires near-perfect conditions. The 4% rule is more realistic over 30-35 year horizons."
                }
            },
            3: {
                correct: "Passive income requires little to no ongoing effort after initial setup—like rental properties, dividends, or royalties.",
                wrong: {
                    'A': "Income from a job is ACTIVE income—you must work each day to earn it.",
                    'C': "Freelance work is ACTIVE income—you trade time for money continuously.",
                    'D': "Side hustles are typically ACTIVE income unless they're fully automated business systems."
                }
            },
            4: {
                correct: "To reach FIRE at 40 (earn $60k/year, need $1.5M), you'd need to save/invest aggressively—roughly $5,000+/month assuming 7% returns for ~15 years.",
                wrong: {
                    'A': "$2,000/month is too low—you'd need much more to reach $1.5M starting at 25 with only 15 years of investing.",
                    'B': "$3,500/month wouldn't cut it either—the math requires even higher monthly investments to reach FIRE.",
                    'C': "$4,500/month might get close but $5,000+ monthly gives you a better shot at $1.5M in 15 years."
                }
            },
            5: {
                correct: "Geographic arbitrage means moving to areas with lower living costs while maintaining your income level, accelerating your path to FIRE.",
                wrong: {
                    'A': "Currency trading is a separate investment strategy, not specifically about FIRE or cost of living.",
                    'B': "Diversifying globally can help, but geographic arbitrage is about WHERE you live, not WHERE you invest.",
                    'D': "Remote work enables this strategy, but the concept is about lowering expenses by moving, not just working remotely."
                }
            },
            6: {
                correct: "This is FALSE. Coast FIRE means you've saved enough that compound growth will reach your FIRE number without further contributions—you still need some ongoing income.",
                wrong: {
                    'True': "Actually false. Coast FIRE requires some income to cover current expenses while your investments grow to FIRE levels."
                }
            },
            7: {
                correct: "This is FALSE. Lean FIRE focuses on minimal expenses and extreme savings—achievable but requires significant sacrifice and discipline.",
                wrong: {
                    'True': "Actually false. Lean FIRE is achievable for many with high savings rates and low-cost lifestyles, though it requires commitment."
                }
            },
            8: {
                correct: "This is TRUE. Tax-advantaged accounts like 401(k)s and IRAs are crucial for FIRE due to their tax benefits accelerating growth.",
                wrong: {
                    'False': "Actually true. Tax-advantaged accounts are essential tools for reaching FIRE because they reduce taxes and boost returns."
                }
            },
            9: {
                correct: "This is TRUE. You can still work in FIRE—many 'retire early' to do meaningful work rather than traditional employment.",
                wrong: {
                    'False': "Actually true. FIRE often means financial independence to pursue passion projects, not necessarily sitting on a beach forever."
                }
            },
            10: {
                correct: "This is FALSE. Tracking expenses is crucial because you need to know your spending to calculate your FIRE number accurately.",
                wrong: {
                    'True': "Actually false. You MUST track spending to calculate your FIRE target (typically 25x annual expenses) and stay on track."
                }
            }
        },
        9: {
            1: {
                correct: "Net worth is your assets (what you own: savings, investments, property) minus your liabilities (debts you owe).",
                wrong: {
                    'B': "This would be cash flow, not net worth. Net worth is your financial snapshot at a point in time.",
                    'C': "This is gross income. Net worth is about your total financial position including assets AND debts.",
                    'D': "This describes active income. Net worth is the VALUE of everything you own minus what you owe."
                }
            },
            2: {
                correct: "Starting to track your net worth at 18-25 gives time to build wealth, make course corrections, and reach ambitious goals.",
                wrong: {
                    'A': "30-35 is still good but starting earlier gives more time for compound growth and wealth building.",
                    'C': "40-45 is late but better than never. The younger you start tracking, the more options you have.",
                    'D': "Waiting until 50+ severely limits wealth-building time and flexibility."
                }
            },
            3: {
                correct: "You'd manually calculate by listing all assets (cash, investments, property value) and subtracting all debts (loans, credit cards).",
                wrong: {
                    'A': "Reviewing spending shows cash flow, not net worth. You need to know what you OWN minus what you OWE.",
                    'C': "Counting income shows cash flow. Net worth = assets (savings, investments, property) minus debts.",
                    'D': "Checking credit score shows debt management. You need the full picture: everything you own minus everything you owe."
                }
            },
            4: {
                correct: "Your net worth is $35,000: assets ($70,000) minus liabilities ($35,000) = $35,000.",
                wrong: {
                    'A': "You can't have negative $40,000—assets exceed liabilities, so net worth is positive at $35,000.",
                    'C': "$70,000 is only your assets. You must subtract your $35,000 debt to get net worth: $70,000 - $35,000 = $35,000.",
                    'D': "$105,000 would be adding assets to debts, which doesn't make sense. Net worth = assets minus debts."
                }
            },
            5: {
                correct: "Side hustles increase net worth by adding income you can save/invest, or by creating business assets you can sell later.",
                wrong: {
                    'A': "Side hustles that you DO use to pay down debt and invest absolutely increase net worth over time.",
                    'B': "Side hustle income that's spent immediately doesn't grow wealth—you need to invest it to increase net worth.",
                    'C': "Many side hustles create sellable business value or generate income that, when saved, builds net worth significantly."
                }
            },
            6: {
                correct: "This is TRUE. Home equity (your home's value minus mortgage debt) is a major asset that boosts your net worth.",
                wrong: {
                    'False': "Actually true. If your home value exceeds your mortgage balance, that equity contributes significantly to your net worth."
                }
            },
            7: {
                correct: "This is FALSE. Student loans are liabilities that reduce your net worth, even if they funded an education that boosts earning power.",
                wrong: {
                    'True': "Actually false. Student loan debt is a liability that lowers net worth, though the education may increase future earning potential."
                }
            },
            8: {
                correct: "This is FALSE. Automating savings and investing is a key strategy for building wealth without relying on willpower.",
                wrong: {
                    'True': "Actually false. Automation is crucial—it builds wealth consistently without requiring daily motivation and effort."
                }
            },
            9: {
                correct: "This is TRUE. A positive net worth means your assets exceed your debts—a healthy financial position.",
                wrong: {
                    'False': "Actually true. When assets exceed liabilities, you're in a positive financial position worth tracking and growing."
                }
            },
            10: {
                correct: "This is TRUE. Update your net worth monthly to track progress, spot issues early, and stay motivated toward your goals.",
                wrong: {
                    'False': "Actually true. Monthly tracking helps you see progress, catch problems early, and maintain financial awareness."
                }
            }
        }
    };
    
    // Get the explanation for this question
    const questionExplanations = explanations[moduleNumber]?.[questionNum];
    
    if (!questionExplanations) {
        return {
            correct: "You got this right! Keep up the great work.",
            wrong: "Let's review the correct approach to improve your understanding."
        };
    }
    
    // Return appropriate explanation based on user's answer
    return {
        correct: questionExplanations.correct,
        wrong: questionExplanations.wrong[userAnswer] || "Let's review why this answer isn't correct."
    };
}

function openTool(toolType) {
    const modal = document.getElementById('tool-modal');
    const toolTitle = document.getElementById('tool-title');
    const toolBody = document.getElementById('tool-body');
    
    const tools = {
        budget: {
            title: 'Budget Calculator',
            content: `
                <div class="tool-form">
                    <h3>Create Your Monthly Budget</h3>
                    <div class="form-group">
                        <label for="monthly-income">Monthly Income (after taxes)</label>
                        <input type="number" id="monthly-income" placeholder="Enter your monthly income">
                    </div>
                    <div class="form-group">
                        <label for="rent">Rent/Housing</label>
                        <input type="number" id="rent" placeholder="Enter rent amount">
                    </div>
                    <div class="form-group">
                        <label for="food">Food & Groceries</label>
                        <input type="number" id="food" placeholder="Enter food budget">
                    </div>
                    <div class="form-group">
                        <label for="transportation">Transportation</label>
                        <input type="number" id="transportation" placeholder="Enter transportation costs">
                    </div>
                    <div class="form-group">
                        <label for="utilities">Utilities</label>
                        <input type="number" id="utilities" placeholder="Enter utilities cost">
                    </div>
                    <div class="form-group">
                        <label for="entertainment">Entertainment</label>
                        <input type="number" id="entertainment" placeholder="Enter entertainment budget">
                    </div>
                    <div class="form-group">
                        <label for="savings">Savings Goal</label>
                        <input type="number" id="savings" placeholder="Enter savings goal">
                    </div>
                    <button class="btn btn-primary" onclick="calculateBudget()">Calculate Budget</button>
                    <div id="budget-results"></div>
                </div>
            `
        },
        savings: {
            title: 'Savings Goal Tracker',
            content: `
                <div class="tool-form">
                    <h3>Track Your Savings Goals</h3>
                    <div class="form-group">
                        <label for="goal-amount">Goal Amount</label>
                        <input type="number" id="goal-amount" placeholder="Enter your savings goal">
                    </div>
                    <div class="form-group">
                        <label for="current-savings">Current Savings</label>
                        <input type="number" id="current-savings" placeholder="Enter current savings">
                    </div>
                    <div class="form-group">
                        <label for="monthly-contribution">Monthly Contribution</label>
                        <input type="number" id="monthly-contribution" placeholder="Enter monthly contribution">
                    </div>
                    <div class="form-group">
                        <label for="interest-rate">Annual Interest Rate (%)</label>
                        <input type="number" id="interest-rate" placeholder="Enter interest rate" step="0.1">
                    </div>
                    <button class="btn btn-primary" onclick="calculateSavings()">Calculate Timeline</button>
                    <div id="savings-results"></div>
                </div>
            `
        },
        emergency: {
            title: 'Emergency Fund Calculator',
            content: `
                <div class="tool-form">
                    <h3>Calculate Your Emergency Fund</h3>
                    <div class="form-group">
                        <label for="monthly-expenses">Monthly Expenses</label>
                        <input type="number" id="monthly-expenses" placeholder="Enter monthly expenses">
                    </div>
                    <div class="form-group">
                        <label for="months-coverage">Months of Coverage Desired</label>
                        <select id="months-coverage">
                            <option value="3">3 months (minimum)</option>
                            <option value="6" selected>6 months (recommended)</option>
                            <option value="12">12 months (maximum security)</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="current-emergency-fund">Current Emergency Fund</label>
                        <input type="number" id="current-emergency-fund" placeholder="Enter current emergency fund">
                    </div>
                    <button class="btn btn-primary" onclick="calculateEmergencyFund()">Calculate Goal</button>
                    <div id="emergency-results"></div>
                </div>
            `
        },
        debt: {
            title: 'Debt Payoff Calculator',
            content: `
                <div class="tool-form">
                    <h3>Plan Your Debt Payoff</h3>
                    <div class="form-group">
                        <label for="debt-balance">Total Debt Balance</label>
                        <input type="number" id="debt-balance" placeholder="Enter total debt amount">
                    </div>
                    <div class="form-group">
                        <label for="interest-rate-debt">Annual Interest Rate (%)</label>
                        <input type="number" id="interest-rate-debt" placeholder="Enter interest rate" step="0.1">
                    </div>
                    <div class="form-group">
                        <label for="monthly-payment">Monthly Payment</label>
                        <input type="number" id="monthly-payment" placeholder="Enter monthly payment">
                    </div>
                    <button class="btn btn-primary" onclick="calculateDebtPayoff()">Calculate Payoff Plan</button>
                    <div id="debt-results"></div>
                </div>
            `
        }
    };
    
    if (tools[toolType]) {
        toolTitle.textContent = tools[toolType].title;
        toolBody.innerHTML = tools[toolType].content;
        
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }
}

function closeTool() {
    const modal = document.getElementById('tool-modal');
    modal.classList.remove('show');
    document.body.style.overflow = 'auto';
}

// Tool calculation functions
function calculateBudget() {
    const income = parseFloat(document.getElementById('monthly-income').value) || 0;
    const rent = parseFloat(document.getElementById('rent').value) || 0;
    const food = parseFloat(document.getElementById('food').value) || 0;
    const transportation = parseFloat(document.getElementById('transportation').value) || 0;
    const utilities = parseFloat(document.getElementById('utilities').value) || 0;
    const entertainment = parseFloat(document.getElementById('entertainment').value) || 0;
    const savings = parseFloat(document.getElementById('savings').value) || 0;
    
    const totalExpenses = rent + food + transportation + utilities + entertainment + savings;
    const remaining = income - totalExpenses;
    
    const resultsDiv = document.getElementById('budget-results');
    resultsDiv.innerHTML = `
        <div class="tool-result">
            <h3>Budget Summary</h3>
            <div class="result-value">$${income.toLocaleString()}</div>
            <p>Monthly Income</p>
            <div style="margin-top: 1rem;">
                <p><strong>Total Expenses:</strong> $${totalExpenses.toLocaleString()}</p>
                <p><strong>Remaining:</strong> $${remaining.toLocaleString()}</p>
                <p style="color: ${remaining >= 0 ? '#10b981' : '#ef4444'};">
                    ${remaining >= 0 ? '✅ Budget balanced!' : '⚠️ Overspending by $' + Math.abs(remaining).toLocaleString()}
                </p>
            </div>
        </div>
    `;
}

function calculateSavings() {
    const goalAmount = parseFloat(document.getElementById('goal-amount').value) || 0;
    const currentSavings = parseFloat(document.getElementById('current-savings').value) || 0;
    const monthlyContribution = parseFloat(document.getElementById('monthly-contribution').value) || 0;
    const interestRate = parseFloat(document.getElementById('interest-rate').value) || 0;
    
    const remainingAmount = goalAmount - currentSavings;
    const monthlyRate = interestRate / 100 / 12;
    
    let months = 0;
    let balance = currentSavings;
    
    while (balance < goalAmount && months < 600) { // Max 50 years
        balance += monthlyContribution;
        balance *= (1 + monthlyRate);
        months++;
    }
    
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    
    const resultsDiv = document.getElementById('savings-results');
    resultsDiv.innerHTML = `
        <div class="tool-result">
            <h3>Savings Timeline</h3>
            <div class="result-value">${years}y ${remainingMonths}m</div>
            <p>Time to reach goal</p>
            <div style="margin-top: 1rem;">
                <p><strong>Goal Amount:</strong> $${goalAmount.toLocaleString()}</p>
                <p><strong>Current Savings:</strong> $${currentSavings.toLocaleString()}</p>
                <p><strong>Monthly Contribution:</strong> $${monthlyContribution.toLocaleString()}</p>
                <p><strong>Interest Rate:</strong> ${interestRate}% annually</p>
            </div>
        </div>
    `;
}

function calculateEmergencyFund() {
    const monthlyExpenses = parseFloat(document.getElementById('monthly-expenses').value) || 0;
    const monthsCoverage = parseInt(document.getElementById('months-coverage').value) || 6;
    const currentFund = parseFloat(document.getElementById('current-emergency-fund').value) || 0;
    
    const targetAmount = monthlyExpenses * monthsCoverage;
    const neededAmount = targetAmount - currentFund;
    
    const resultsDiv = document.getElementById('emergency-results');
    resultsDiv.innerHTML = `
        <div class="tool-result">
            <h3>Emergency Fund Goal</h3>
            <div class="result-value">$${targetAmount.toLocaleString()}</div>
            <p>Target Amount</p>
            <div style="margin-top: 1rem;">
                <p><strong>Monthly Expenses:</strong> $${monthlyExpenses.toLocaleString()}</p>
                <p><strong>Coverage Period:</strong> ${monthsCoverage} months</p>
                <p><strong>Current Fund:</strong> $${currentFund.toLocaleString()}</p>
                <p><strong>Still Needed:</strong> $${neededAmount.toLocaleString()}</p>
                <p style="color: ${neededAmount <= 0 ? '#10b981' : '#f59e0b'};">
                    ${neededAmount <= 0 ? '✅ Goal achieved!' : 'Keep saving!'}
                </p>
            </div>
        </div>
    `;
}

function calculateDebtPayoff() {
    const debtBalance = parseFloat(document.getElementById('debt-balance').value) || 0;
    const interestRate = parseFloat(document.getElementById('interest-rate-debt').value) || 0;
    const monthlyPayment = parseFloat(document.getElementById('monthly-payment').value) || 0;
    
    const monthlyRate = interestRate / 100 / 12;
    let balance = debtBalance;
    let months = 0;
    let totalInterest = 0;
    
    while (balance > 0 && months < 600) { // Max 50 years
        const interestPayment = balance * monthlyRate;
        const principalPayment = monthlyPayment - interestPayment;
        
        if (principalPayment <= 0) {
            months = 600; // Infinite loop protection
            break;
        }
        
        balance -= principalPayment;
        totalInterest += interestPayment;
        months++;
    }
    
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    
    const resultsDiv = document.getElementById('debt-results');
    resultsDiv.innerHTML = `
        <div class="tool-result">
            <h3>Debt Payoff Plan</h3>
            <div class="result-value">${years}y ${remainingMonths}m</div>
            <p>Time to pay off debt</p>
            <div style="margin-top: 1rem;">
                <p><strong>Original Debt:</strong> $${debtBalance.toLocaleString()}</p>
                <p><strong>Monthly Payment:</strong> $${monthlyPayment.toLocaleString()}</p>
                <p><strong>Total Interest:</strong> $${totalInterest.toLocaleString()}</p>
                <p><strong>Total Paid:</strong> $${(debtBalance + totalInterest).toLocaleString()}</p>
            </div>
        </div>
    `;
}

function updateProgress() {
    const totalModules = 10;
    const completionPercentage = Math.round((userProgress.modulesCompleted / totalModules) * 100);
    
    // Update progress circle
    const circleProgress = document.getElementById('circle-progress');
    if (circleProgress) {
        circleProgress.style.background = `conic-gradient(var(--primary-color) 0deg, var(--primary-color) ${completionPercentage * 3.6}deg, var(--border-color) ${completionPercentage * 3.6}deg)`;
    }
    
    // Update percentage text
    const progressPercentage = document.getElementById('progress-percentage');
    if (progressPercentage) {
        progressPercentage.textContent = `${completionPercentage}%`;
    }
    
    // Update stats
    const modulesCompleted = document.getElementById('modules-completed');
    const quizzesPassed = document.getElementById('quizzes-passed');
    const timeSpent = document.getElementById('time-spent');
    
    if (modulesCompleted) modulesCompleted.textContent = userProgress.modulesCompleted;
    if (quizzesPassed) quizzesPassed.textContent = userProgress.quizzesPassed;
    if (timeSpent) timeSpent.textContent = userProgress.timeSpent;
    
    // Update module cards to show completed status
    updateModuleCards();
    
    // Save progress
    saveUserProgress();
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#6366f1'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        box-shadow: var(--shadow-lg);
        z-index: 3000;
        animation: slideInRight 0.3s ease;
        max-width: 300px;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Add CSS for notification animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(100%);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes slideOutRight {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100%);
        }
    }
`;
document.head.appendChild(style);

// Authentication Functions
async function checkAuthState() {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session) {
        authState = {
            isAuthenticated: true,
            user: session.user,
            provider: session.user.app_metadata?.provider || 'email'
        };
        currentUser = session.user;
        
        
        updateNavForAuthenticatedUser();
        await loadUserProgress();
    }
}

window.openAuthModal = function(type) {
    console.log('Opening auth modal:', type);
    const modal = document.getElementById('auth-modal');
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    
    if (!modal) {
        console.error('Auth modal not found!');
        return;
    }
    
    if (type === 'login') {
        loginForm.style.display = 'block';
        signupForm.style.display = 'none';
    } else {
        signupForm.style.display = 'block';
        loginForm.style.display = 'none';
    }
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    console.log('Modal should be visible now');
}

window.closeAuthModal = function() {
    const modal = document.getElementById('auth-modal');
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
    
    // Clear form inputs
    document.getElementById('login-email').value = '';
    document.getElementById('login-password').value = '';
    document.getElementById('signup-name').value = '';
    document.getElementById('signup-email').value = '';
    document.getElementById('signup-password').value = '';
}

// Close modal when clicking outside
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('auth-modal');
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeAuthModal();
            }
        });
    }
});

window.switchAuthMode = function(type) {
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    
    if (type === 'login') {
        loginForm.style.display = 'block';
        signupForm.style.display = 'none';
    } else {
        signupForm.style.display = 'block';
        loginForm.style.display = 'none';
    }
}

// Email/Password Authentication
window.handleLogin = async function(e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    const submitBtn = e.target.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging in...';
    
    try {
        if (!supabase) {
            throw new Error('Authentication service not available. Please refresh the page.');
        }
        
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password
        });
        
        if (error) throw error;
        
        authState = {
            isAuthenticated: true,
            user: data.user,
            provider: 'email'
        };
        currentUser = data.user;
        
        updateNavForAuthenticatedUser();
        closeAuthModal();
        showNotification('Welcome back! 🎉', 'success');
        await loadUserProgress();
    } catch (error) {
        console.error('Login error:', error);
        showNotification(error.message || 'Login failed. Please try again.', 'error');
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Log In';
    }
}

window.handleSignup = async function(e) {
    console.log('🔵 Signup button clicked');
    e.preventDefault();
    
    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    
    console.log('📝 Form values:', { name, email, password: '***' });
    
    if (!name || !email || !password) {
        showNotification('Please fill in all fields', 'error');
        return;
    }
    
    if (password.length < 6) {
        showNotification('Password must be at least 6 characters', 'error');
        return;
    }
    
    const submitBtn = e.target.querySelector('button[type="submit"]');
    if (!submitBtn) {
        console.error('❌ Submit button not found');
        return;
    }
    
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating account...';
    
    try {
        console.log('🔍 Checking Supabase client...', supabase ? '✅ Available' : '❌ Not available');
        
        if (!supabase) {
            // Try to reinitialize
            initSupabase();
            if (!supabase) {
                throw new Error('Authentication service not available. Please refresh the page.');
            }
        }
        
        console.log('📤 Sending signup request to Supabase...');
        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password,
            options: {
                data: {
                    full_name: name
                }
            }
        });
        
        console.log('📥 Supabase response:', { data, error });
        
        if (error) throw error;
        
        if (!data.user) {
            throw new Error('No user data returned from signup');
        }
        
        console.log('✅ User created:', data.user.id);
        
        authState = {
            isAuthenticated: true,
            user: data.user,
            provider: 'email'
        };
        currentUser = data.user;
        
        // Create user profile in database
        console.log('📝 Creating user profile...');
        await createUserProfile(data.user.id, name, email);
        
        updateNavForAuthenticatedUser();
        closeAuthModal();
        showNotification('Account created successfully! Welcome to Finquest! 🚀', 'success');
        await loadUserProgress();
        
        console.log('✅ Signup complete!');
    } catch (error) {
        console.error('❌ Signup error:', error);
        showNotification(error.message || 'Signup failed. Please try again.', 'error');
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-user-plus"></i> Sign Up';
    }
}


function updateNavForAuthenticatedUser() {
    const navAuth = document.getElementById('nav-auth');
    const userName = authState.user.user_metadata?.full_name || authState.user.email.split('@')[0];
    const userInitial = userName.charAt(0).toUpperCase();
    
    navAuth.innerHTML = `
        <div class="user-profile">
            <div class="user-avatar">${userInitial}</div>
            <div class="user-info">
                <div class="user-name">${userName}</div>
                <div class="user-email">${authState.user.email}</div>
            </div>
            <button class="btn-logout" onclick="signOut()">
                <i class="fas fa-sign-out-alt"></i>
                Logout
            </button>
        </div>
    `;
    
    // Add styles for user nav
    const userNavStyle = document.createElement('style');
    userNavStyle.textContent = `
        .user-nav {
            display: flex;
            align-items: center;
        }
        
        .btn-dashboard {
            display: flex;
            align-items: center;
            gap: var(--space-sm);
            background: var(--gradient-primary);
            color: white;
            border: none;
            padding: var(--space-sm) var(--space-lg);
            border-radius: var(--radius-lg);
            font-weight: 600;
            cursor: pointer;
            transition: all var(--transition-normal);
        }
        
        .btn-dashboard:hover {
            transform: translateY(-2px);
            box-shadow: var(--shadow-lg);
        }
        
        .nav-avatar {
            width: 32px;
            height: 32px;
            border-radius: var(--radius-full);
            border: 2px solid rgba(255, 255, 255, 0.3);
        }
    `;
    document.head.appendChild(userNavStyle);
}

function openUserModal() {
    const modal = document.getElementById('user-modal');
    const userName = document.getElementById('user-name');
    const userEmail = document.getElementById('user-email');
    const userAvatar = document.getElementById('user-avatar');
    const userModulesCompleted = document.getElementById('user-modules-completed');
    const userTimeSpent = document.getElementById('user-time-spent');
    const userStreak = document.getElementById('user-streak');
    
    userName.textContent = authState.user.name;
    userEmail.textContent = authState.user.email;
    userAvatar.src = authState.user.avatar;
    userModulesCompleted.textContent = userProgress.modulesCompleted;
    userTimeSpent.textContent = userProgress.timeSpent;
    userStreak.textContent = userProgress.streak;
    
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
}

function closeUserModal() {
    const modal = document.getElementById('user-modal');
    modal.classList.remove('show');
    document.body.style.overflow = 'auto';
}

window.signOut = async function() {
    await supabase.auth.signOut();
    
    authState = {
        isAuthenticated: false,
        user: null,
        provider: null
    };
    currentUser = null;
    
    // Reset user progress to initial state
    userProgress = {
        modulesCompleted: 0,
        quizzesPassed: 0,
        timeSpent: 0,
        completedModules: [],
        quizzesCompleted: [],
        streak: 0,
        lastActiveDate: null
    };
    
    // Update progress display to show reset state
    updateProgress();
    updateProgressDisplay();
    
    // Reset nav to login/signup buttons
    const navAuth = document.getElementById('nav-auth');
    navAuth.innerHTML = `
        <button class="btn-auth btn-login" onclick="openAuthModal('login')">
            <i class="fas fa-sign-in-alt"></i>
            Log In
        </button>
        <button class="btn-auth btn-signup" onclick="openAuthModal('signup')">
            <i class="fas fa-user-plus"></i>
            Sign Up
        </button>
    `;
    
    showNotification('Signed out successfully', 'info');
}

// Database Functions
async function createUserProfile(userId, name, email) {
    try {
        const { error } = await supabase
            .from('user_profiles')
            .insert([
                { 
                    user_id: userId,
                    full_name: name,
                    email: email,
                    modules_completed: 0,
                    quizzes_passed: 0,
                    time_spent: 0,
                    completed_modules: [],
                    quizzes_completed: [],
                    streak: 0
                }
            ]);
        
        if (error) throw error;
    } catch (error) {
        console.error('Error creating user profile:', error);
    }
}

async function loadUserProgress() {
    if (authState.isAuthenticated && currentUser) {
        try {
            console.log('Loading progress for user:', currentUser.id);
            const { data, error } = await supabase
                .from('user_profiles')
                .select('*')
                .eq('user_id', currentUser.id)
                .single();
            
            if (error && error.code !== 'PGRST116') throw error;
            
            if (data) {
                console.log('Progress data loaded from database:', data);
                userProgress = {
                    modulesCompleted: data.modules_completed || 0,
                    quizzesPassed: data.quizzes_passed || 0,
                    timeSpent: data.time_spent || 0,
                    completedModules: data.completed_modules || [],
                    quizzesCompleted: data.quizzes_completed || [],
                    streak: data.streak || 0,
                    lastActiveDate: data.last_active_date
                };
                console.log('User progress updated in memory:', userProgress);
                updateProgressDisplay();
                updateProgress();
            } else {
                console.log('No progress data found for user, initializing new progress');
                // If no data found, ensure we have a fresh start
                userProgress = {
                    modulesCompleted: 0,
                    quizzesPassed: 0,
                    timeSpent: 0,
                    completedModules: [],
                    quizzesCompleted: [],
                    streak: 0,
                    lastActiveDate: null
                };
                updateProgressDisplay();
                updateProgress();
            }
        } catch (error) {
            console.error('Error loading user progress:', error);
            // Initialize fresh progress on error
            userProgress = {
                modulesCompleted: 0,
                quizzesPassed: 0,
                timeSpent: 0,
                completedModules: [],
                quizzesCompleted: [],
                streak: 0,
                lastActiveDate: null
            };
            updateProgressDisplay();
            updateProgress();
        }
    }
}

// Update progress display in UI
function updateProgressDisplay() {
    const totalModules = 10;
    const completionPercentage = Math.round((userProgress.modulesCompleted / totalModules) * 100);
    
    // Update progress circle
    const circleProgress = document.getElementById('circle-progress');
    if (circleProgress) {
        circleProgress.style.background = `conic-gradient(var(--primary-color) 0deg, var(--primary-color) ${completionPercentage * 3.6}deg, var(--border-color) ${completionPercentage * 3.6}deg)`;
    }
    
    // Update percentage text
    const progressPercentage = document.getElementById('progress-percentage');
    if (progressPercentage) {
        progressPercentage.textContent = `${completionPercentage}%`;
    }
    
    // Update stats
    const modulesCompleted = document.getElementById('modules-completed');
    const quizzesPassed = document.getElementById('quizzes-passed');
    const timeSpent = document.getElementById('time-spent');
    
    if (modulesCompleted) modulesCompleted.textContent = userProgress.modulesCompleted;
    if (quizzesPassed) quizzesPassed.textContent = userProgress.quizzesPassed;
    if (timeSpent) timeSpent.textContent = userProgress.timeSpent;
    
    // Update module cards to show completed status
    updateModuleCards();
}

// Update module cards UI based on completion status
function updateModuleCards() {
    const moduleCards = document.querySelectorAll('.module-card');
    
    moduleCards.forEach(card => {
        const moduleNum = parseInt(card.getAttribute('data-module'));
        const startButton = card.querySelector('.module-btn');
        
        // Check if module is locked (must complete previous module first)
        const isLocked = moduleNum > 1 && (!userProgress.quizzesCompleted || !userProgress.quizzesCompleted.includes(moduleNum - 1));
        
        if (userProgress.completedModules && userProgress.completedModules.includes(moduleNum)) {
            // Module is completed - show checkmark and allow restart
            card.classList.add('completed');
            card.classList.remove('locked');
            if (startButton) {
                startButton.innerHTML = '<i class="fas fa-check-circle"></i> Completed - Restart';
                startButton.disabled = false;
                startButton.onclick = (e) => { e.stopPropagation(); openModule(moduleNum); };
            }
        } else if (isLocked) {
            // Module is locked - show lock icon and disable
            card.classList.add('locked');
            card.classList.remove('completed');
            if (startButton) {
                startButton.innerHTML = '<i class="fas fa-lock"></i> Complete Previous Module';
                startButton.disabled = true;
                startButton.onclick = null;
            }
        } else {
            // Module is unlocked and not completed - normal state
            card.classList.remove('completed', 'locked');
            if (startButton) {
                startButton.innerHTML = '<i class="fas fa-play"></i> Start Module';
                startButton.disabled = false;
                startButton.onclick = (e) => { e.stopPropagation(); openModule(moduleNum); };
            }
        }
    });
}

async function saveUserProgress() {
    if (authState.isAuthenticated && currentUser) {
        try {
            console.log('Saving progress for user:', currentUser.id);
            console.log('Progress to save:', userProgress);
            const { error } = await supabase
                .from('user_profiles')
                .update({
                    modules_completed: userProgress.modulesCompleted,
                    quizzes_passed: userProgress.quizzesPassed,
                    time_spent: userProgress.timeSpent,
                    completed_modules: userProgress.completedModules,
                    quizzes_completed: userProgress.quizzesCompleted,
                    streak: userProgress.streak,
                    last_active_date: new Date().toISOString()
                })
                .eq('user_id', currentUser.id);
            
            if (error) throw error;
            console.log('Progress saved successfully to database');
        } catch (error) {
            console.error('Error saving user progress:', error);
            showNotification('Failed to save progress. Please check your connection.', 'error');
        }
    } else {
        console.warn('Cannot save progress: User not authenticated');
    }
}

function loadUserProgressOld() {
    if (authState.isAuthenticated) {
        const userProgressKey = `finquestProgress_${authState.user.id}`;
        const savedProgress = localStorage.getItem(userProgressKey);
        if (savedProgress) {
            userProgress = JSON.parse(savedProgress);
        } else {
            // Initialize new user progress
            userProgress = {
                modulesCompleted: 0,
                quizzesPassed: 0,
                timeSpent: 0,
                completedModules: [],
                streak: 0,
                lastActiveDate: new Date().toDateString()
            };
            saveUserProgress();
        }
        updateProgress();
    }
}

// Removed duplicate saveUserProgress - using Supabase version above

function viewProfile() {
    showNotification('Profile view coming soon!', 'info');
}

function exportProgress() {
    const progressData = {
        user: authState.user,
        progress: userProgress,
        exportDate: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(progressData, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `finquest-progress-${authState.user.name.replace(/\s+/g, '-')}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
    showNotification('Progress exported successfully!', 'success');
}
