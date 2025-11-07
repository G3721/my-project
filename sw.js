// Service Worker for Yoga Sutras Study Website
// 提供离线支持和缓存优化

const CACHE_NAME = 'yoga-sutras-v1.0.0';
const STATIC_CACHE = 'yoga-sutras-static-v1.0.0';
const DATA_CACHE = 'yoga-sutras-data-v1.0.0';

// 需要缓存的静态资源
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/css/style.css',
  '/js/app.js',
  '/site.webmanifest',
  'https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@400;500;700&family=Noto+Sans+SC:wght@300;400;500;700&display=swap'
];

// 需要缓存的数据文件
const DATA_ASSETS = [
  '/data/yoga-sutras.json'
];

// Service Worker 安装事件
self.addEventListener('install', event => {
  console.log('📦 Service Worker 安装中...');

  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => {
        console.log('✅ 静态资源缓存完成');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        return caches.open(DATA_CACHE);
      })
      .then(cache => {
        console.log('✅ 数据资源缓存完成');
        return cache.addAll(DATA_ASSETS);
      })
      .then(() => {
        console.log('🎉 Service Worker 安装完成');
        self.skipWaiting();
      })
      .catch(error => {
        console.error('❌ Service Worker 安装失败:', error);
      })
  );
});

// Service Worker 激活事件
self.addEventListener('activate', event => {
  console.log('🚀 Service Worker 激活中...');

  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            // 删除旧版本缓存
            if (cacheName !== STATIC_CACHE && cacheName !== DATA_CACHE) {
              console.log('🗑️ 删除旧缓存:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('✅ Service Worker 激活完成');
        return self.clients.claim();
      })
  );
});

// 网络请求拦截
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // 跳过非HTTP(S)请求
  if (!url.protocol.startsWith('http')) {
    return;
  }

  // 处理不同的资源类型
  if (STATIC_ASSETS.some(asset => url.pathname === asset || url.href === asset)) {
    // 静态资源：缓存优先策略
    event.respondWith(
      caches.match(request)
        .then(cachedResponse => {
          if (cachedResponse) {
            return cachedResponse;
          }

          // 网络请求
          return fetch(request)
            .then(response => {
              // 检查响应是否有效
              if (!response || response.status !== 200 || response.type !== 'basic') {
                return response;
              }

              // 缓存响应
              const responseToCache = response.clone();
              caches.open(STATIC_CACHE)
                .then(cache => {
                  cache.put(request, responseToCache);
                });

              return response;
            });
        })
    );
  } else if (DATA_ASSETS.some(asset => url.pathname === asset)) {
    // 数据文件：网络优先策略，失败时使用缓存
    event.respondWith(
      fetch(request)
        .then(response => {
          // 检查响应是否有效
          if (!response || response.status !== 200) {
            throw new Error('数据文件加载失败');
          }

          // 缓存新的数据
          const responseToCache = response.clone();
          caches.open(DATA_CACHE)
            .then(cache => {
              cache.put(request, responseToCache);
            });

          return response;
        })
        .catch(() => {
          // 网络失败时使用缓存
          console.log('📱 使用离线缓存数据');
          return caches.match(request);
        })
    );
  } else if (url.origin === self.location.origin) {
    // 同源请求：缓存优先
    event.respondWith(
      caches.match(request)
        .then(response => {
          return response || fetch(request);
        })
    );
  } else {
    // 外部资源（如字体）：直接网络请求
    event.respondWith(fetch(request));
  }
});

// 后台同步事件（用于更新数据）
self.addEventListener('sync', event => {
  if (event.tag === 'update-data') {
    event.waitUntil(updateDataFiles());
  }
});

// 更新数据文件
async function updateDataFiles() {
  try {
    console.log('🔄 更新数据文件...');

    for (const asset of DATA_ASSETS) {
      try {
        const response = await fetch(asset);
        if (response.ok) {
          const cache = await caches.open(DATA_CACHE);
          await cache.put(asset, response);
          console.log('✅ 数据文件更新成功:', asset);
        }
      } catch (error) {
        console.error('❌ 数据文件更新失败:', asset, error);
      }
    }

    console.log('🎉 数据更新完成');
  } catch (error) {
    console.error('❌ 数据更新过程失败:', error);
  }
}

// 推送通知事件（可选功能）
self.addEventListener('push', event => {
  if (event.data) {
    const options = {
      body: event.data.text(),
      icon: '/android-chrome-192x192.png',
      badge: '/favicon-32x32.png',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: 1
      }
    };

    event.waitUntil(
      self.registration.showNotification('瑜伽经学习', options)
    );
  }
});

console.log('🕉️ Yoga Sutras Service Worker 已加载');