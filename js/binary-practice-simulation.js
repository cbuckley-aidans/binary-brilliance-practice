function renderSimulation(containerId) {
    const BinaryPractice = () => {
        const [currentQuestion, setCurrentQuestion] = React.useState(0);
        const [bits, setBits] = React.useState([0, 0, 0, 0, 0, 0, 0, 0]);
        const [feedback, setFeedback] = React.useState('');
        const [feedbackType, setFeedbackType] = React.useState('');
        const [earnedBuckles, setEarnedBuckles] = React.useState(new Set());
        const [showCoin, setShowCoin] = React.useState(false);

        const questions = [
            { number: 4, level: 1 },
            { number: 2, level: 1 },
            { number: 8, level: 1 },
            { number: 15, level: 2 },
            { number: 12, level: 2 },
            { number: 7, level: 2 },
            { number: 31, level: 3 },
            { number: 24, level: 3 },
            { number: 19, level: 3 },
            { number: 127, level: 4 },
            { number: 96, level: 4 },
            { number: 64, level: 4 },
            { number: 255, level: 5 },
            { number: 192, level: 5 },
            { number: 224, level: 5 }
        ];

        const levelDescriptions = {
            1: "Simple powers of 2",
            2: "Numbers up to 15",
            3: "Numbers up to 31",
            4: "Numbers up to 127",
            5: "Full byte range"
        };

        const animateCoin = () => {
            setShowCoin(true);
            setTimeout(() => setShowCoin(false), 2000);
        };

        const toggleBit = (index) => {
            const newBits = [...bits];
            newBits[index] = newBits[index] === 0 ? 1 : 0;
            setBits(newBits);
        };

        const checkAnswer = () => {
            const correctBinary = questions[currentQuestion].number.toString(2).padStart(8, '0').split('').map(Number);
            const isCorrect = bits.every((bit, index) => bit === correctBinary[index]);

            if (isCorrect) {
                setFeedback('Correct! Well done!');
                setFeedbackType('success');
                
                if (!earnedBuckles.has(currentQuestion)) {
                    const bucklesData = JSON.parse(localStorage.getItem('bucklesData') || '{}');
                    if (!bucklesData['1']) bucklesData['1'] = {};
                    
                    if (!bucklesData['1'][currentQuestion]) {
                        bucklesData['1'][currentQuestion] = true;
                        localStorage.setItem('bucklesData', JSON.stringify(bucklesData));
                        
                        const totalBuckles = parseInt(localStorage.getItem('totalBuckles') || '0') + 1;
                        localStorage.setItem('totalBuckles', totalBuckles);
                        
                        const bucklesCount = document.getElementById('buckles-count');
                        if (bucklesCount) bucklesCount.textContent = totalBuckles;
                        
                        setEarnedBuckles(new Set([...earnedBuckles, currentQuestion]));
                        animateCoin();
                    }
                }
                
                setTimeout(() => {
                    setBits([0, 0, 0, 0, 0, 0, 0, 0]);
                    setFeedback('');
                    setCurrentQuestion((currentQuestion + 1) % questions.length);
                }, 1500);
            } else {
                setFeedback(`Incorrect. Try again!`);
                setFeedbackType('error');
            }
        };

        React.useEffect(() => {
            const bucklesData = JSON.parse(localStorage.getItem('bucklesData') || '{}');
            if (bucklesData['1']) {
                setEarnedBuckles(new Set(
                    Object.entries(bucklesData['1'])
                        .filter(([_, earned]) => earned)
                        .map(([index]) => parseInt(index))
                ));
            }
        }, []);

        const BitButton = ({ value, index }) => {
            const powerValue = Math.pow(2, 7-index);
            return React.createElement('div', {
                className: 'flex flex-col items-center space-y-2'
            }, [
                React.createElement('div', {
                    className: 'text-sm text-gray-400',
                    key: 'power'
                }, powerValue),
                React.createElement('button', {
                    key: 'bit',
                    onClick: () => toggleBit(index),
                    className: `w-12 h-12 rounded-lg text-xl font-bold transition-colors ${
                        value ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'
                    }`
                }, value),
                React.createElement('div', {
                    className: 'text-sm text-gray-400',
                    key: 'value'
                }, value ? powerValue : '0')
            ]);
        };

        return React.createElement('div', { className: 'space-y-6 relative' }, [
            showCoin && React.createElement('div', {
                key: 'coin',
                className: 'fixed inset-0 flex items-center justify-center z-50',
                style: {
                    animation: 'coinPop 2s ease-out forwards'
                }
            }, React.createElement('div', {
                className: 'w-32 h-32 bg-yellow-500 rounded-full flex items-center justify-center text-4xl font-bold text-yellow-900 shadow-lg',
                style: {
                    animation: 'coinRotate 2s ease-out'
                }
            }, 'B')),
            
            React.createElement('div', { 
                key: 'level',
                className: 'text-lg font-semibold text-blue-400'
            }, `Level ${questions[currentQuestion].level}: ${levelDescriptions[questions[currentQuestion].level]}`),
            
            React.createElement('div', { 
                key: 'number',
                className: 'text-2xl font-bold mb-8'
            }, `Convert ${questions[currentQuestion].number} to binary`),
            
            React.createElement('div', {
                key: 'bits-container',
                className: 'flex justify-center space-x-4 mb-8'
            }, bits.map((bit, index) => 
                React.createElement(BitButton, {
                    key: index,
                    value: bit,
                    index: index
                })
            )),
            
            React.createElement('div', {
                key: 'decimal-value',
                className: 'text-xl text-center mb-6'
            }, `Decimal value: ${parseInt(bits.join(''), 2)}`),
            
            React.createElement('div', {
                key: 'button-container',
                className: 'flex justify-center'
            }, React.createElement('button', {
                onClick: checkAnswer,
                className: 'bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors text-lg'
            }, 'Check Answer')),
            
            feedback && React.createElement('div', {
                key: 'feedback',
                className: `text-lg text-center mt-4 ${feedbackType === 'success' ? 'text-green-400' : 'text-red-400'}`
            }, feedback),

            React.createElement('div', {
                key: 'progress',
                className: 'text-sm text-gray-400 text-center'
            }, `Question ${currentQuestion + 1} of ${questions.length} ${earnedBuckles.has(currentQuestion) ? '(Buckle already earned)' : ''}`)
        ]);
    };

    ReactDOM.render(
        React.createElement(BinaryPractice),
        document.getElementById(containerId)
    );
}

window.renderSimulation = renderSimulation;