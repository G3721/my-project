// 瑜伽经三语学习 - 极简浏览版本
let yogaData = null;

// 加载瑜伽经数据
async function loadYogaData() {
    try {
        const response = await fetch('data/yoga-sutras.json');
        yogaData = await response.json();
        renderAllSutras();
    } catch (error) {
        console.error('Error loading yoga sutras:', error);
        document.getElementById('all-sutras').innerHTML =
            '<p style="text-align: center; color: #666;">加载失败，请检查网络连接</p>';
    }
}

// 渲染所有经文 - 带懒加载优化
function renderAllSutras() {
    const container = document.getElementById('all-sutras');
    container.innerHTML = '';

    // 创建文档片段提升性能
    const fragment = document.createDocumentFragment();

    yogaData.chapters.forEach((chapter, chapterIndex) => {
        // 添加章节标题
        const chapterTitle = document.createElement('h2');
        chapterTitle.className = 'chapter-title';
        chapterTitle.innerHTML = `
            第${chapter.id}章：${chapter.name_zh}<br>
            <span class="chapter-subtitle">${chapter.name}</span><br>
            <span class="chapter-english">${chapter.name_en}</span>
        `;
        fragment.appendChild(chapterTitle);

        // 渲染该章节的所有经文
        chapter.sutras.forEach((sutra, sutraIndex) => {
            const sutraElement = createSutraElement(sutra);

            // 添加懒加载属性
            sutraElement.setAttribute('data-chapter', chapterIndex);
            sutraElement.setAttribute('data-sutra', sutraIndex);

            // 如果经文数量很多，实现懒加载
            if (sutraIndex > 10) {
                sutraElement.classList.add('lazy-sutra');
                sutraElement.style.opacity = '0';
                sutraElement.style.transform = 'translateY(20px)';
            }

            fragment.appendChild(sutraElement);
        });
    });

    // 一次性添加所有元素
    container.appendChild(fragment);

    // 实现懒加载
    observeLazySutras();
}

// 懒加载观察器
function observeLazySutras() {
    if (!('IntersectionObserver' in window)) {
        // 浏览器不支持 IntersectionObserver，直接显示所有经文
        document.querySelectorAll('.lazy-sutra').forEach(sutra => {
            sutra.style.opacity = '1';
            sutra.style.transform = 'translateY(0)';
        });
        return;
    }

    const lazySutraObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sutra = entry.target;
                sutra.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                sutra.style.opacity = '1';
                sutra.style.transform = 'translateY(0)';
                observer.unobserve(sutra);
            }
        });
    }, {
        rootMargin: '100px 0px'
    });

    // 观察所有懒加载的经文
    document.querySelectorAll('.lazy-sutra').forEach(sutra => {
        lazySutraObserver.observe(sutra);
    });
}

// 创建经文元素
function createSutraElement(sutra) {
    const div = document.createElement('div');
    div.className = 'sutra';

    div.innerHTML = `
        <div class="sutra-number">${sutra.id}</div>
        <div class="sutra-content">
            <div class="sanskrit">${sutra.sanskrit}</div>
            <div class="transliteration">${sutra.transliteration}</div>
            <div class="english">${sutra.english}</div>
            <div class="chinese">${sutra.chinese}</div>
        </div>
    `;

    return div;
}

// 注册 Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('✅ Service Worker 注册成功:', registration.scope);
            })
            .catch(error => {
                console.log('❌ Service Worker 注册失败:', error);
            });
    });
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', loadYogaData);