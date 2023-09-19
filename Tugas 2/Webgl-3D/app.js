const canvas = document.getElementById('webgl-canvas');
const gl = canvas.getContext('webgl');
if (!gl) {
    console.error('WebGL tidak tersedia di browser Anda.');
}

const vertexShaderSource = `
    // Vertex Shader
    attribute vec4 a_position;
    attribute vec2 a_texCoord;
    uniform mat4 u_modelViewMatrix;
    varying vec2 v_texCoord;
    void main() {
        gl_Position = u_modelViewMatrix * a_position;
        v_texCoord = a_texCoord;
    }
`;

const fragmentShaderSource = `
    // Fragment Shader
    precision mediump float;
    varying vec2 v_texCoord;
    uniform sampler2D u_texture;
    void main() {
        gl_FragColor = texture2D(u_texture, v_texCoord);
    }
`;

// Definisi vertices dan texCoords objek 3D
const vertices = new Float32Array([
    // Koordinat vertex dan texCoord
    -1.0, -1.0, 0.0, 1.0,
    1.0, -1.0, 1.0, 1.0,
    -1.0, 1.0, 0.0, 0.0,
    1.0, 1.0, 1.0, 0.0,
]);

// Membuat dan menghubungkan tekstur
const texture = gl.createTexture();
const textureImage = new Image();

textureImage.onload = function () {
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, textureImage);
    gl.generateMipmap(gl.TEXTURE_2D);
};

textureImage.src = 'texture.png'; // Ganti dengan URL gambar tekstur Anda

// Inisialisasi matriks model-view
const modelViewMatrix = mat4.create();
let angle = 0;
let isAnimating = true;

// Fungsi untuk menggambar objek
function draw() {
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    mat4.rotate(modelViewMatrix, modelViewMatrix, Math.PI / 180, [0, 1, 0]);
    mat4.scale(modelViewMatrix, modelViewMatrix, [0.5, 0.5, 0.5]);

    const modelViewMatrixLoc = gl.getUniformLocation(shaderProgram, 'u_modelViewMatrix');
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, modelViewMatrix);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    if (isAnimating) {
        requestAnimationFrame(draw);
    }
}

// Mulai animasi
document.getElementById('start-button').addEventListener('click', function () {
    isAnimating = true;
    requestAnimationFrame(draw);
});

// Hentikan animasi
document.getElementById('stop-button').addEventListener('click', function () {
    isAnimating = false;
});

// Inisialisasi dan mulai animasi
draw();
