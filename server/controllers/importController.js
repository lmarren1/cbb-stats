const { spawn } = require('child_process');
const path = require('path');

exports.handleIngest = async function (data) {
    const pythonPath = 'python3';
    const scriptPath = path.join(__dirname, 'ingest.py');

    return new Promise((resolve, reject) => {
        const python = spawn(pythonPath, [scriptPath]);

        let stdout = '';
        let stderr = '';

        python.stdout.on('data', (chunk) => {
            stdout += chunk.toString();
        });

        python.stderr.on('data', (chunk) => {
            stderr += chunk.toString();
        });

        python.on('close', (code) => {
            if (code === 0) {
                try {
                    resolve(JSON.parse(stdout));
                } catch (err) {
                    reject(new Error('Python returned invalid JSON'));
                }
            } else {
                reject(new Error(stderr || `Python exited with code ${code}`));
            }
        });

        python.stdin.write(JSON.stringify(data));
        python.stdin.end();
    });
};
