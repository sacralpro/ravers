'use client';

import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass";
import { CopyShader } from "three/examples/jsm/shaders/CopyShader";
import { useEffect, useRef, useState } from "react";

export default function ThreeJSCanvas() {
    const canvasRef = useRef(null);
    const [textureLoaded, setTextureLoaded] = useState(false);

    useEffect(() => {
        // Initialize scene
        const renderer = new THREE.WebGLRenderer({});
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(100, 2, 0.1, 1000);
        const controls = new OrbitControls(camera, renderer.domElement);

        const resizeHandler = () => {
            const { clientWidth, clientHeight } = renderer.domElement;
            renderer.setSize(clientWidth, clientHeight, false);
            renderer.setPixelRatio(window.devicePixelRatio);
            camera.aspect = clientWidth / clientHeight;
            camera.updateProjectionMatrix();
        };

        window.addEventListener("resize", resizeHandler);
        document.body.prepend(renderer.domElement);
        window.dispatchEvent(new Event("resize"));

        camera.position.set(-1, 1, 8);
        renderer.shadowMap.enabled = true;
        scene.background = new THREE.Color(0xDD3BEE);

        const light0 = new THREE.DirectionalLight(0xDD3BEE, 2.45);
        light0.position.set(2, 5, 1);
        light0.castShadow = true;
        light0.shadow.bias = -0.004;
        scene.add(light0);

        // Shader
        const url0 = "/images/artwork.png"; // Image URL
        const pass0 = new ShaderPass({
            uniforms: THREE.UniformsUtils.merge([
                CopyShader.uniforms,
                {
                    t: { value: 0 },
                    map: { value: null },
                },
            ]),
            vertexShader: CopyShader.vertexShader,
            fragmentShader: `
                #define SPEED 0.20
                #define OFFSET (texel.r * 7.0)
                uniform sampler2D map;
                uniform float t;
                varying vec2 vUv;
                void main() {
                    vec4 texel = texture2D(map, vUv);
                    float h = sin((-t * 0.01 - OFFSET + dot(vUv, vUv)) * SPEED) * 0.5 + 0.5;
                    gl_FragColor = vec4(h, h * 0.96, 0.48, 1.0); // Changed!
                }
            `,
        });

        const texLoader = new THREE.TextureLoader();
        const tex0 = texLoader.load(url0, (texture) => {
            setTextureLoaded(true); // Set texture loaded state
        });

        pass0.material.uniforms.map.value = tex0;

        // Generate displacement map
        const composer = new EffectComposer(renderer);
        composer.renderToScreen = false;
        composer.addPass(pass0);

        window.addEventListener("resize", () => {
            composer.setPixelRatio(window.devicePixelRatio);
            composer.setSize(renderer.domElement.clientWidth, renderer.domElement.clientHeight);
        });

        // Plane for the image without distortion
        const imagePlane = new THREE.Mesh(
            new THREE.PlaneBufferGeometry(10, 10, 32, 32),
            new THREE.MeshBasicMaterial({
                map: tex0,
                transparent: true,
                opacity: 0.9,
            })
        );

        imagePlane.position.z = 4;
        scene.add(imagePlane);

        // Create a grayscale displacement map
        const displacementMap = createDisplacementMap(tex0);

        // Object with displacement map (modified)
        const mesh = new THREE.Mesh(
            new THREE.PlaneBufferGeometry(10, 10, 512, 512),
            new THREE.MeshStandardMaterial({
                map: null,
                displacementMap: displacementMap,
                displacementScale: 2,
                displacementBias: 1,
                roughness: 1,
                metalness: 0,
                size: 4.80,
                transparent: false,
                opacity: 1,
            })
        );

        mesh.position.z = 1; // z-coordinate less than imagePlane
        mesh.castShadow = mesh.receiveShadow = true;
        mesh.customDepthMaterial = new THREE.MeshDepthMaterial({
            depthPacking: THREE.RGBADepthPacking,
            displacementMap: displacementMap,
            displacementScale: mesh.material.displacementScale,
            displacementBias: mesh.material.displacementBias,
        });
        scene.add(mesh);

        // Wall
        const wall = new THREE.Mesh(
            new THREE.PlaneBufferGeometry(100, 100),
            new THREE.ShadowMaterial()
        );

        wall.receiveShadow = true;
        scene.add(wall);

        // Animation loop
        renderer.setAnimationLoop((t) => {
            if (textureLoaded) { // Only render if texture is loaded
                composer.render();
                mesh.material.displacementMap = mesh.customDepthMaterial.displacementMap = composer.readBuffer.texture;
                renderer.render(scene, camera);
                controls.update();
                pass0.material.uniforms.t.value = t;
                const a = t * 0.001;
                light0.position.set(7 * Math.sin(a), 7 * Math.cos(a), 3);
            }
        });

        return () => {
            // Cleanup on unmount
            window.removeEventListener("resize", resizeHandler);
            renderer.dispose();
            scene.dispose();
        };
    }, [textureLoaded]); // Add textureLoaded to dependencies

    return <div ref={canvasRef} style={{ width: "100vw", height: "100vh" }} />;
}

// Helper function to create a grayscale displacement map
function createDisplacementMap(texture) {
    if (!texture || !texture.image) {
        console.error("Texture not loaded yet!");
        return null; // Handle the error appropriately
    }

    const canvas = document.createElement('canvas');
    canvas.width = texture.image.width;
    canvas.height = texture.image.height;
    const context = canvas.getContext('2d');
    context.drawImage(texture.image, 0, 0);
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < imageData.data.length; i += 4) {
        const grayScaleValue = (imageData.data[i] + imageData.data[i + 1] + imageData.data[i + 2]) / 3;
        imageData.data[i] = grayScaleValue;
        imageData.data[i + 1] = grayScaleValue;
        imageData.data[i + 2] = grayScaleValue;
    }

    context.putImageData(imageData, 0, 0);
    const displacementTexture = new THREE.CanvasTexture(canvas);
    displacementTexture.needsUpdate = true;

    return displacementTexture;
}
