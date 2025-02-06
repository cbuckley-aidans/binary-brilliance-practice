function renderSimulation(containerId) {
  const AudioPractice = () => {
    const [currentQuestion, setCurrentQuestion] = React.useState(0);
    const [showFeedback, setShowFeedback] = React.useState(false);
    const [isCorrect, setIsCorrect] = React.useState(false);
    const [earnedBuckle, setEarnedBuckle] = React.useState(false);
    const [showCoin, setShowCoin] = React.useState(false);

    React.useEffect(() => {
      const bucklesData = JSON.parse(localStorage.getItem('bucklesData') || '{}');
      if (bucklesData['3'] && bucklesData['3'][currentQuestion]) {
          setEarnedBuckle(true);
      } else {
          setEarnedBuckle(false);
      }
  }, [currentQuestion]);

      const questions = [
        {
            type: 'definition',
            question: "What is bit depth?",
            options: [
                "How often we record the sound",
                "How many different volume levels we can store"
            ],
            correctAnswer: 1,
            explanation: "Bit depth determines how many different volume levels can be stored. Higher bit depth means more precise volume measurements."
        },
        {
            type: 'definition',
            question: "What is sampling frequency?",
            options: [
                "How many times per second we measure the sound",
                "How many volume levels we can record"
            ],
            correctAnswer: 0,
            explanation: "Sampling frequency (measured in Hz) is how many times per second we measure and record the sound wave."
        },
        {
            type: 'definition',
            question: "What is aliasing?",
            options: [
                "When a sound is too quiet to record",
                "When sampling frequency is too low, causing distortion"
            ],
            correctAnswer: 1,
            explanation: "Aliasing occurs when we don't sample fast enough to capture the wave properly, creating distortion in the recording."
        },
        {
            type: 'waveform',
            question: "Which audio sample needs a higher bit depth?",
            options: [
                {
                    waveform: generateWaveform('simple'),
                    description: "Single instrument"
                },
                {
                    waveform: generateWaveform('complex'),
                    description: "Multiple instruments"
                }
            ],
            correctAnswer: 1,
            explanation: "Multiple instruments create more complex sounds with a wider range of volumes. Higher bit depth captures these variations."
        },
        {
            type: 'scenario',
            question: "A singer with a wide vocal range needs to record. What's most important?",
            options: [
                "High sampling frequency to capture pitch",
                "High bit depth to capture volume range"
            ],
            correctAnswer: 1,
            explanation: "A wide vocal range needs high bit depth to capture both very quiet and very loud notes clearly."
        },
        {
            type: 'scenario',
            question: "You're recording a high-pitched flute. What's most important?",
            options: [
                "High sampling frequency",
                "High bit depth"
            ],
            correctAnswer: 0,
            explanation: "High-pitched instruments need high sampling frequency to capture their rapid wave oscillations."
        },
        {
            type: 'sampling',
            question: "What sampling frequency for this high-frequency wave?",
            waveform: generateWaveform('highFreq'),
            options: ["8 kHz", "192 kHz"],
            correctAnswer: 1,
            explanation: "High frequencies need faster sampling rates to capture the rapid changes in the wave."
        },
        {
            type: 'quality',
            question: "Which audio settings would capture better quality?",
            options: [
                "192 kHz sampling rate, 24-bit depth",
                "8 kHz sampling rate, 8-bit depth"
            ],
            correctAnswer: 0,
            explanation: "Higher sampling rates and bit depth capture more detail in both time and volume."
        },
        {
            type: 'technical',
            question: "What happens if bit depth is too low?",
            options: [
                "The sound becomes slower",
                "The sound becomes grainy or rough"
            ],
            correctAnswer: 1,
            explanation: "Low bit depth causes quantization noise, making sound grainy because volume changes aren't smooth."
        },
        {
            type: 'scenario',
            question: "You're recording bass guitar. What's most important?",
            options: [
                "Very high sampling frequency",
                "Good bit depth"
            ],
            correctAnswer: 1,
            explanation: "Bass frequencies are low, so they don't need extremely high sampling rates. Bit depth is important for dynamic range."
        },
        {
            type: 'waveform',
            question: "Which wave needs fewer samples per second?",
            options: [
                {
                    waveform: generateWaveform('box'),
                    description: "Square wave"
                },
                {
                    waveform: generateWaveform('smooth'),
                    description: "Sine wave"
                }
            ],
            correctAnswer: 0,
            explanation: "Square waves have simpler patterns that need fewer samples to represent accurately."
        },
        {
            type: 'sampling',
            question: "What sampling rate is sufficient for this low-frequency wave?",
            waveform: generateWaveform('lowFreq'),
            options: ["192 kHz", "44.1 kHz"],
            correctAnswer: 1,
            explanation: "Low-frequency waves change slowly, so they don't need extremely high sampling rates."
        },
        {
            type: 'bitDepth',
            question: "Select the bit depth needed for studio recording:",
            options: [
                "16-bit (65,536 volume levels)",
                "24-bit (16,777,216 volume levels)"
            ],
            correctAnswer: 1,
            explanation: "24-bit depth provides more volume levels, capturing subtle variations in loud and quiet sounds."
        },
        {
            type: 'technical',
            question: "Why do CDs use 44.1 kHz sampling rate?",
            options: [
                "It's enough to capture frequencies up to 22 kHz",
                "It saves space compared to 48 kHz"
            ],
            correctAnswer: 0,
            explanation: "The sampling rate must be twice the highest frequency we want to capture. Human hearing goes up to about 20 kHz."
        },
        {
            type: 'scenario',
            question: "You're recording thunder. What's most important?",
            options: [
                "High sampling frequency",
                "High bit depth"
            ],
            correctAnswer: 1,
            explanation: "Thunder has a huge dynamic range from very quiet to very loud. Bit depth captures this range better."
        }
    ];

      function generateWaveform(type) {
          const width = 300;
          const height = 100;
          const points = [];
          
          for (let x = 0; x < width; x++) {
              let y = 0;
              switch(type) {
                  case 'simple':
                      y = Math.sin(x * 0.05) * 30 + height/2;
                      break;
                  case 'complex':
                      y = (Math.sin(x * 0.05) + Math.sin(x * 0.08) * 0.5 + Math.sin(x * 0.12) * 0.3) * 20 + height/2;
                      break;
                  case 'highFreq':
                      y = Math.sin(x * 0.2) * 30 + height/2;
                      break;
                  case 'lowFreq':
                      y = Math.sin(x * 0.02) * 30 + height/2;
                      break;
                  case 'box':
                      y = Math.round(Math.sin(x * 0.05)) * 30 + height/2;
                      break;
                  case 'smooth':
                      y = Math.sin(x * 0.05) * 30 + height/2;
                      break;
                  case 'normal':
                      y = Math.sin(x * 0.1) * 30 + height/2;
                      break;
                  case 'aliased':
                      y = Math.sin(x * 0.1) * 30 + Math.sin(x * 0.3) * 15 + height/2;
                      break;
              }
              points.push(`${x},${y}`);
          }
          
          return React.createElement('svg', {
              width: width,
              height: height,
              className: "bg-gray-800 rounded"
          }, 
          React.createElement('polyline', {
              points: points.join(' '),
              fill: "none",
              stroke: "#60A5FA",
              strokeWidth: "2"
          }));
      }

      const handleAnswer = (selectedAnswer) => {
        const correct = selectedAnswer === questions[currentQuestion].correctAnswer;
        setIsCorrect(correct);
        setShowFeedback(true);
        
        if (correct) {
            const bucklesData = JSON.parse(localStorage.getItem('bucklesData') || '{}');
            if (!bucklesData['3']) bucklesData['3'] = {};
            
            if (!bucklesData['3'][currentQuestion] && !earnedBuckle) {
                bucklesData['3'][currentQuestion] = true;
                localStorage.setItem('bucklesData', JSON.stringify(bucklesData));
                
                const currentBuckles = parseInt(localStorage.getItem('totalBuckles') || '0');
                localStorage.setItem('totalBuckles', currentBuckles + 1);
                setEarnedBuckle(true);
                setShowCoin(true);
                
                const bucklesCount = document.getElementById('buckles-count');
                if (bucklesCount) bucklesCount.textContent = currentBuckles + 1;

                setTimeout(() => setShowCoin(false), 2000);
            }
        }
    };

    const nextQuestion = () => {
        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
            setShowFeedback(false);
        }
    };

    return React.createElement('div', { 
        className: "w-full max-w-4xl mx-auto p-6 relative" 
    }, [
        showCoin && React.createElement('div', {
            key: 'coin',
            className: "fixed inset-0 flex items-center justify-center z-50"
        }, 
        React.createElement('div', {
            className: "w-32 h-32 bg-yellow-500 rounded-full flex items-center justify-center text-4xl font-bold text-yellow-900",
            style: {
                animation: "coinAnimation 2s ease-out forwards"
            }
        }, "B")),
        
        React.createElement('div', {
            key: 'progress',
            className: "text-sm text-gray-400 mb-4"
        }, `Question ${currentQuestion + 1} of ${questions.length}`),
        
        React.createElement('div', {
            key: 'card',
            className: "p-6 bg-gray-800 rounded-lg shadow-lg"
        }, [
            React.createElement('h2', {
                key: 'question',
                className: "text-2xl font-bold mb-6"
            }, questions[currentQuestion].question),
            
            questions[currentQuestion].waveform && React.createElement('div', {
                key: 'waveform',
                className: "mb-6 flex justify-center"
            }, questions[currentQuestion].waveform),
            
            React.createElement('div', {
                key: 'options',
                className: "grid gap-4"
            }, questions[currentQuestion].options.map((option, index) => 
                React.createElement('button', {
                    key: index,
                    onClick: () => handleAnswer(index),
                    className: "p-4 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors flex items-center gap-4"
                }, option.waveform ? [
                    option.waveform,
                    React.createElement('span', {key: 'desc'}, option.description)
                ] : option)
            )),
            
            showFeedback && React.createElement('div', {
                key: 'feedback',
                className: `mt-4 p-4 rounded-lg ${isCorrect ? 'bg-green-800' : 'bg-red-800'}`
            }, [
                React.createElement('p', {
                    key: 'result',
                    className: "font-bold mb-2"
                }, isCorrect ? "Correct" : "Incorrect"),
                React.createElement('p', {
                    key: 'explanation'
                }, questions[currentQuestion].explanation),
                isCorrect && React.createElement('button', {
                    key: 'next',
                    onClick: nextQuestion,
                    className: "mt-4 px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded"
                }, currentQuestion < questions.length - 1 ? "Next Question" : "Complete")
            ])
        ])
    ]);
};

// Add the coin animation style
const style = document.createElement('style');
style.textContent = `
    @keyframes coinAnimation {
        0% { transform: scale(0) rotate(0deg); opacity: 0; }
        20% { transform: scale(1.2) rotate(180deg); opacity: 1; }
        40% { transform: scale(1) rotate(360deg); opacity: 1; }
        60% { transform: scale(1) rotate(360deg); opacity: 1; }
        100% { transform: scale(0) rotate(720deg); opacity: 0; }
    }
`;
document.head.appendChild(style);

ReactDOM.render(
    React.createElement(AudioPractice),
    document.getElementById(containerId)
);
}

window.renderSimulation = renderSimulation;