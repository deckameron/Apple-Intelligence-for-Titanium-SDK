// ============================================
// ROBUST VERIFICATION USAGE EXAMPLE
// To avoid GenerationError -1 error
// ============================================

const AppleAI = require('ti.apple.intelligence');

// ============================================
// HELPER FUNCTION - CHECK IF READY
// ============================================

function checkModelReady(callback) {
    console.log('Starting model verification...\n');
    
    // 1. Basic check
    console.log('Basic check:');
    if (!AppleAI.isAvailable) {
        const status = AppleAI.availabilityStatus;
        console.log('Not available:', status.reason);
        callback({
            ready: false,
            error: 'Apple Intelligence not available',
            reason: status.reason
        });
        return;
    }
    console.log('API reports as available');
    
    // 2. Detailed diagnostics
    console.log('\nDetailed diagnostics:');
    const diag = AppleAI.diagnostics();
    
    console.log('   iOS:', diag.ios_version);
    console.log('   Device:', diag.device_model);
    console.log('   Status:', diag.status);
    
    if (diag.free_space_gb) {
        console.log('   Free space:', diag.free_space_gb, 'GB');
        console.log('   Enough space:', diag.enough_space ? '✅' : '❌');
        
        if (!diag.enough_space) {
            callback({
                ready: false,
                error: 'Insufficient space',
                suggestion: 'Free up at least 7 GB of space',
                diagnostics: diag
            });
            return;
        }
    }
    
    if (diag.status !== 'available') {
        console.log('   Status is not "available"');
        console.log('   Reason:', diag.reason);
        console.log('   Solution:', diag.fix);
        
        callback({
            ready: false,
            error: diag.reason || 'Model not available',
            suggestion: diag.fix || 'Check settings',
            diagnostics: diag
        });
        return;
    }
    
    console.log('Diagnostics passed');
    
    // 3. Wait for model to be really ready
    console.log('\n3️⃣ Waiting for model to be ready (real test)...');
    AppleAI.waitForModel({
        maxAttempts: 15,  // 15 attempts
        delay: 2.0,       // Every 2 seconds = 30s maximum
        callback: (result) => {
            if (result.ready) {
                console.log('   Model REALLY ready!');
                console.log('   Attempts needed:', result.attempts);
                callback({ ready: true });
            } else {
                console.log('   Model not ready');
                console.log('   Error:', result.error);
                console.log('   Suggestion:', result.suggestion);
                console.log('   Attempts:', result.attempts);
                
                callback({
                    ready: false,
                    error: result.error,
                    suggestion: result.suggestion,
                    attempts: result.attempts
                });
            }
        }
    });
}

// ============================================
// USE MODEL SAFELY
// ============================================

function useModel() {
    checkModelReady((status) => {
        if (!status.ready) {
            // Show detailed error to user
            const message = `
Unable to use Apple Intelligence:

 ${status.error}

 Suggestion: ${status.suggestion || 'Check settings'}

${status.reason ? '\n Details: ' + status.reason : ''}
            `.trim();
            
            alert(message);
            console.error('Model not ready:', status);
            return;
        }
        
        //  NOW YES! Model is ready
        console.log('\n Model ready! Starting generation...\n');
        
        // Here you can use any AppleAI method
        exampleTextGeneration();
    });
}

// ============================================
// USAGE EXAMPLES
// ============================================

function exampleTextGeneration() {
    AppleAI.generateText({
        prompt: 'Explain what artificial intelligence is in 2 sentences.',
        callback: (result) => {
            if (result.success) {
                console.log(' SUCCESS!');
                console.log('Response:', result.text);
                alert('It worked!\n\n' + result.text);
            } else {
                console.error(' ERROR:', result.error);
                alert('Error: ' + result.error);
            }
        }
    });
}

function exampleArticleAnalysis() {
    const text = `
        Artificial intelligence is transforming the world.
        With increasingly powerful models, we can 
        automate complex tasks and create personalized 
        experiences for users.
    `;
    
    AppleAI.analyzeArticle({
        text: text,
        callback: (result) => {
            if (result.success) {
                console.log('Title:', result.data.titulo);
                console.log('Summary:', result.data.resumo);
                console.log('Sentiment:', result.data.sentimento);
            } else {
                console.error('Error:', result.error);
            }
        }
    });
}

function exampleStreaming() {
    let fullText = '';
    
    AppleAI.addEventListener('textChunk', (e) => {
        if (!e.isComplete) {
            fullText += e.text;
            console.log('Chunk:', e.text);
            // Update UI in real time
            if ($.label) {
                $.label.text = fullText;
            }
        } else {
            console.log('Stream complete!');
        }
    });
    
    AppleAI.streamText({
        prompt: 'Write a short story about technology.'
    });
}

// ============================================
// COMPLETE TEST WITH LOGGING
// ============================================

function completeTestWithLog() {
    console.log('╔════════════════════════════════════════╗');
    console.log('║  APPLE INTELLIGENCE COMPLETE TEST     ║');
    console.log('╚════════════════════════════════════════╝\n');
    
    // Step 1: Check basic availability
    console.log('STEP 1: Basic check');
    console.log('─────────────────────────────────────────');
    const available = AppleAI.isAvailable;
    console.log('isAvailable:', available);
    
    if (!available) {
        console.log(' Cannot continue\n');
        alert('Apple Intelligence is not available on this device.');
        return;
    }
    
    const status = AppleAI.availabilityStatus;
    console.log('Status:', JSON.stringify(status, null, 2));
    console.log('');
    
    // Step 2: Complete diagnostics
    console.log('STEP 2: Complete diagnostics');
    console.log('─────────────────────────────────────────');
    const diag = AppleAI.diagnostics();
    console.log('Diagnostics:', JSON.stringify(diag, null, 2));
    console.log('');
    
    // Step 3: Wait to be ready
    console.log('STEP 3: Waiting for model to be ready');
    console.log('─────────────────────────────────────────');
    
    AppleAI.waitForModel({
        maxAttempts: 20,
        delay: 2.0,
        callback: (result) => {
            console.log('waitForModel result:', JSON.stringify(result, null, 2));
            console.log('');
            
            if (result.ready) {
                // Step 4: Real test
                console.log('STEP 4: Generation test');
                console.log('─────────────────────────────────────────');
                
                AppleAI.generateText({
                    prompt: 'Say "Hello world" in English.',
                    callback: (r) => {
                        console.log('generateText result:', JSON.stringify(r, null, 2));
                        
                        if (r.success) {
                            console.log('\n╔════════════════════════════════════════╗');
                            console.log('║         ✅ TEST PASSED!               ║');
                            console.log('╚════════════════════════════════════════╝');
                            console.log('Response:', r.text);
                            
                            alert(' Test passed!\n\n' + r.text);
                        } else {
                            console.log('\n╔════════════════════════════════════════╗');
                            console.log('║         ❌ TEST FAILED                ║');
                            console.log('╚════════════════════════════════════════╝');
                            console.log('Error:', r.error);
                            
                            alert(' Test failed:\n\n' + r.error);
                        }
                    }
                });
            } else {
                console.log('\n╔════════════════════════════════════════╗');
                console.log('║    ❌ MODEL NOT READY                  ║');
                console.log('╚════════════════════════════════════════╝');
                console.log('Error:', result.error);
                console.log('Suggestion:', result.suggestion);
                
                alert(' Model not ready:\n\n' + 
                      result.error + '\n\n' +
                      'Suggestion: ' + result.suggestion);
            }
        }
    });
}

// ============================================
// CONVENIENT WRAPPER
// ============================================

// Wrapper function that ensures model is ready
function withModelReady(func) {
    return function(...args) {
        checkModelReady((status) => {
            if (status.ready) {
                func(...args);
            } else {
                console.error('Model not ready:', status.error);
                alert('Model not ready: ' + status.error);
            }
        });
    };
}

// Using the wrapper:
const safeGenerateText = withModelReady((prompt) => {
    AppleAI.generateText({
        prompt: prompt,
        callback: (result) => {
            if (result.success) {
                console.log('Response:', result.text);
            }
        }
    });
});

// ============================================
// EXPORT
// ============================================

module.exports = {
    checkModelReady,
    useModel,
    exampleTextGeneration,
    exampleArticleAnalysis,
    exampleStreaming,
    completeTestWithLog,
    withModelReady
};

// ============================================
// QUICK USAGE
// ============================================

/*
// In your app.js:

const helpers = require('example-robust-verification');

// Option 1: Check and use manually
helpers.checkModelReady((status) => {
    if (status.ready) {
        // Use AppleAI here
        AppleAI.generateText({...});
    } else {
        alert(status.error);
    }
});

// Option 2: Use wrapper function
const generateText = helpers.withModelReady((text) => {
    AppleAI.generateText({
        prompt: text,
        callback: (r) => console.log(r.text)
    });
});

generateText('My prompt');

// Option 3: Complete test
helpers.completeTestWithLog();
*/