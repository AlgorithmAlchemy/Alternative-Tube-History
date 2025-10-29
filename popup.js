
document.getElementById('addVideo').addEventListener('click', () => {
    const videoUrl = document.getElementById('videoUrl').value.trim();

    if (videoUrl) {
        const videoItem = {
            url: videoUrl,
            timestamp: new Date().toLocaleString()
        };

        chrome.storage.local.get(['videoHistory'], (result) => {
            const history = result.videoHistory || [];
            history.push(videoItem);

            chrome.storage.local.set({ videoHistory: history }, () => {
                displayHistory();
                document.getElementById('videoUrl').value = ''; 
            });
        });
    }
});

function displayHistory() {
    chrome.storage.local.get(['videoHistory'], (result) => {
        const historyList = document.getElementById('historyList');
        historyList.innerHTML = ''; 


        const history = result.videoHistory || [];
        history.forEach(item => {
            const historyItem = document.createElement('div');
            historyItem.classList.add('history-item');
            historyItem.textContent = `${item.url} — ${item.timestamp}`;
            historyList.appendChild(historyItem);
        });
    });
}


document.getElementById('clearHistory').addEventListener('click', () => {
    chrome.storage.local.remove(['videoHistory'], () => {
        displayHistory(); 
    });
});


document.getElementById('exportHistory').addEventListener('click', () => {
    chrome.storage.local.get(['videoHistory'], (result) => {
        const history = result.videoHistory || [];
        const blob = new Blob([JSON.stringify(history)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'videoHistory.json';
        link.click();
    });
});

// Загрузка истории при открытии окна
displayHistory();
