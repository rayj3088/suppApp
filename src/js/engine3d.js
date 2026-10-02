export let scene, camera, renderer, crystalGroup;
export let meshNodeRefs = [];

export function init3DEngine() {
    const container = document.getElementById('three-canvas-container');
    if(!container) return;
    const width = container.clientWidth || 300;
    const height = container.clientHeight || 224;
    
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x020617);
    
    camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 12;
    
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);
    
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    
    const pointLight = new THREE.PointLight(0x2dd4bf, 1, 50);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);
    
    crystalGroup = new THREE.Group();
    scene.add(crystalGroup);
    
    const coreGeo = new THREE.IcosahedronGeometry(2, 1);
    const coreMat = new THREE.MeshBasicMaterial({ color: 0x1e293b, wireframe: true, transparent: true, opacity: 0.3 });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    crystalGroup.add(coreMesh);
    
    animate3DEngine();
    
    window.addEventListener('resize', () => {
        const w = container.clientWidth;
        const h = container.clientHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
    });
}

function animate3DEngine() {
    requestAnimationFrame(animate3DEngine);
    if(crystalGroup) {
        crystalGroup.rotation.y += 0.003;
        crystalGroup.rotation.x += 0.0015;
    }
    meshNodeRefs.forEach(node => {
        node.mesh.position.y += Math.sin(Date.now() * 0.002 + node.seed) * 0.003;
    });
    renderer.render(scene, camera);
}

export function update3DGraph(activeMatches) {
    meshNodeRefs.forEach(node => crystalGroup.remove(node.mesh));
    meshNodeRefs = [];
    if (activeMatches.length === 0) return;
    
    const radius = 3.5;
    activeMatches.forEach((item, index) => {
        const phi = Math.acos(-1 + (2 * index) / activeMatches.length);
        const theta = Math.sqrt(activeMatches.length * Math.PI) * phi;
        let geometry;
        if (item.safety.includes("Scrutinized")) {
            geometry = new THREE.OctahedronGeometry(0.5, 0);
        } else if (item.class.includes("Shell")) {
            geometry = new THREE.TorusGeometry(0.3, 0.1, 8, 24);
        } else {
            geometry = new THREE.SphereGeometry(0.4, 16, 16);
        }
        const material = new THREE.MeshPhongMaterial({
            color: item.color,
            emissive: item.color,
            emissiveIntensity: 0.2,
            shininess: 100,
            flatShading: true
        });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.x = radius * Math.cos(theta) * Math.sin(phi);
        mesh.position.y = radius * Math.sin(theta) * Math.sin(phi);
        mesh.position.z = radius * Math.cos(phi);
        crystalGroup.add(mesh);
        meshNodeRefs.push({ mesh: mesh, name: item.name, seed: Math.random() * 100 });
    });
}
