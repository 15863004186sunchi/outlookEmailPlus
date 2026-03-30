/**
 * Registrar Control - 注册机前端控制器
 */

let registrarInterval = null;

function initRegistrar() {
    refreshRegistrarStatus();
    // 每 5 秒刷新一次状态
    if (registrarInterval) clearInterval(registrarInterval);
    registrarInterval = setInterval(refreshRegistrarStatus, 5000);
}

async function refreshRegistrarStatus() {
    try {
        const resp = await fetch('/api/registrar/status');
        const data = await resp.json();
        updateRegistrarUI(data);
    } catch (e) {
        console.error('Failed to fetch registrar status', e);
        document.getElementById('registrarStatusText').textContent = '连接失败';
        document.getElementById('registrarStatusSub').textContent = '请检查注册机容器是否正常运行';
        document.getElementById('registrarStatusDot').style.background = '#ff4d4f';
    }
}

function updateRegistrarUI(data) {
    const statusText = document.getElementById('registrarStatusText');
    const statusSub = document.getElementById('registrarStatusSub');
    const statusDot = document.getElementById('registrarStatusDot');
    const btnStart = document.getElementById('btnStartRegistrar');
    const btnStop = document.getElementById('btnStopRegistrar');

    if (data.is_running) {
        statusText.textContent = '正在运行';
        statusSub.textContent = `任务进行中... (线程: ${data.config.concurrent_flows})`;
        statusDot.style.background = '#52c41a';
        btnStart.style.display = 'none';
        btnStop.style.display = 'block';
    } else {
        statusText.textContent = '已停止';
        statusSub.textContent = '注册机待命中';
        statusDot.style.background = '#ccc';
        btnStart.style.display = 'block';
        btnStop.style.display = 'none';
    }

    document.getElementById('registrarStatSucceeded').textContent = data.stats.succeeded || 0;
    document.getElementById('registrarStatFailed').textContent = data.stats.failed || 0;
    document.getElementById('registrarStatProgress').textContent = `${data.stats.count || 0}/${data.config.max_tasks || 0}`;
    
    // 同步配置到输入框 (仅在停止状态下)
    if (!data.is_running) {
        document.getElementById('registrarConcurrent').value = data.config.concurrent_flows;
        document.getElementById('registrarMaxTasks').value = data.config.max_tasks;
    }
}

async function startRegistrar() {
    const concurrent = parseInt(document.getElementById('registrarConcurrent').value);
    const maxTasks = parseInt(document.getElementById('registrarMaxTasks').value);

    try {
        const resp = await fetch('/api/registrar/start', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                concurrent_flows: concurrent,
                max_tasks: maxTasks
            })
        });
        const data = await resp.json();
        if (data.success) {
            showToast('注册机启动成功', 'success');
            refreshRegistrarStatus();
        } else {
            showToast('启动失败: ' + data.message, 'danger');
        }
    } catch (e) {
        showToast('请求异常', 'danger');
    }
}

async function stopRegistrar() {
    try {
        const resp = await fetch('/api/registrar/stop', { method: 'POST' });
        const data = await resp.json();
        if (data.success) {
            showToast('注册机停止指令已发送', 'info');
            refreshRegistrarStatus();
        }
    } catch (e) {
        showToast('停止请求失败', 'danger');
    }
}

// 导出初始化函数
window.initRegistrar = initRegistrar;
