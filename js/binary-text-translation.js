function renderSimulation(containerId) {
    const BinaryTextPractice = () => {
        const [currentWord, setCurrentWord] = React.useState(0);
        const [userInput, setUserInput] = React.useState('');
        const [feedback, setFeedback] = React.useState('');
        const [feedbackType, setFeedbackType] = React.useState('');
        const [earnedBuckles, setEarnedBuckles] = React.useState(new Set());
        const [showCoin, setShowCoin] = React.useState(false);

        const words = [
            { binary: '01100011 01100001 01110100', text: 'cat' },
            { binary: '01100100 01101111 01100111', text: 'dog' },
            { binary: '01110010 01110101 01101110', text: 'run' },
            { binary: '01101010 01110101 01101101 01110000', text: 'jump' },
            { binary: '01110011 01110100 01100001 01110010', text: 'star' },
            { binary: '01110011 01110101 01101110', text: 'sun' },
            { binary: '01101101 01100001 01110000', text: 'map' },
            { binary: '01100110 01110101 01101110', text: 'fun' },
            { binary: '01110010 01100001 01101001 01101110', text: 'rain' },
            { binary: '01100110 01101001 01110011 01101000', text: 'fish' },
            { binary: '01100010 01101111 01100001 01110100', text: 'boat' },
            { binary: '01110000 01101100 01100001 01111001', text: 'play' },
            { binary: '01110011 01101011 01111001', text: 'sky' },
            { binary: '01100010 01101001 01110010 01100100', text: 'bird' },
            { binary: '01110100 01110010 01100101 01100101', text: 'tree' }
        ];

        const animateCoin = () => {
            setShowCoin(true);
            setTimeout(() => setShowCoin(false), 2000);
        };

        const checkAnswer = () => {
            const correct = userInput.toLowerCase() === words[currentWord].text;
            
            if (correct) {
                setFeedback('Correct! Well done!');
                setFeedbackType('success');
                
                if (!earnedBuckles.has(currentWord)) {
                    const bucklesData = JSON.parse(localStorage.getItem('bucklesData') || '{}');
                    if (!bucklesData['2']) bucklesData['2'] = {};
                    
                    if (!bucklesData['2'][currentWord]) {
                        bucklesData['2'][currentWord] = true;
                        localStorage.setItem('bucklesData', JSON.stringify(bucklesData));
                        
                        const totalBuckles = parseInt(localStorage.getItem('totalBuckles') || '0') + 1;
                        localStorage.setItem('totalBuckles', totalBuckles);
                        
                        const bucklesCount = document.getElementById('buckles-count');
                        if (bucklesCount) bucklesCount.textContent = totalBuckles;
                        
                        setEarnedBuckles(new Set([...earnedBuckles, currentWord]));
                        animateCoin();
                    }
                }
                
                setTimeout(() => {
                    setUserInput('');
                    setFeedback('');
                    setCurrentWord((currentWord + 1) % words.length);
                }, 1500);
            } else {
                setFeedback('Incorrect. Try again!');
                setFeedbackType('error');
            }
        };

        React.useEffect(() => {
            const bucklesData = JSON.parse(localStorage.getItem('bucklesData') || '{}');
            if (bucklesData['2']) {
                setEarnedBuckles(new Set(
                    Object.entries(bucklesData['2'])
                        .filter(([_, earned]) => earned)
                        .map(([index]) => parseInt(index))
                ));
            }
        }, []);

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
                key: 'binary',
                className: 'text-xl font-mono bg-gray-800 p-4 rounded-lg text-center'
            }, words[currentWord].binary),
            
            React.createElement('div', {
                key: 'input-container',
                className: 'flex flex-col items-center space-y-4'
            }, [
                React.createElement('input', {
                    key: 'input',
                    type: 'text',
                    value: userInput,
                    onChange: (e) => setUserInput(e.target.value),
                    className: 'bg-gray-700 text-white px-4 py-2 rounded-lg w-48 text-center',
                    placeholder: 'Enter text',
                }),
                
                React.createElement('button', {
                    key: 'check',
                    onClick: checkAnswer,
                    className: 'bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors'
                }, 'Check Answer')
            ]),
            
            feedback && React.createElement('div', {
                key: 'feedback',
                className: `text-lg text-center ${feedbackType === 'success' ? 'text-green-400' : 'text-red-400'}`
            }, feedback),
            
            React.createElement('div', {
                key: 'progress',
                className: 'text-sm text-gray-400 text-center'
            }, `Word ${currentWord + 1} of ${words.length} ${earnedBuckles.has(currentWord) ? '(Buckle already earned)' : ''}`)
        ]);
    };

    ReactDOM.render(
        React.createElement(BinaryTextPractice),
        document.getElementById(containerId)
    );
}

window.renderSimulation = renderSimulation;