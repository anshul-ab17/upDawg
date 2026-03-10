"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"

interface Props {
  size?: number
}

function getAccent() {
  return document.documentElement.classList.contains("dark") ? 0x800020 : 0x7b3b4b
}

function buildDog() {
  const dog = new THREE.Group()

  const mat = () =>
    new THREE.MeshPhongMaterial({ color: getAccent(), flatShading: true })
  const darkMat = new THREE.MeshPhongMaterial({ color: 0x111111, flatShading: true })

  // ── Body ──────────────────────────────────────────────────────────────────
  const body = new THREE.Mesh(new THREE.BoxGeometry(1.05, 0.6, 0.55), mat())
  body.position.set(0, 0, 0)
  dog.add(body)

  // ── Head group (pivot at neck) ────────────────────────────────────────────
  const headGroup = new THREE.Group()
  headGroup.position.set(0.64, 0.42, 0)
  dog.add(headGroup)

  const head = new THREE.Mesh(new THREE.BoxGeometry(0.54, 0.52, 0.5), mat())
  headGroup.add(head)

  // Snout
  const snout = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.2, 0.36), mat())
  snout.position.set(0.38, -0.1, 0)
  headGroup.add(snout)

  // Nose
  const nose = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.07, 0.12), darkMat)
  nose.position.set(0.52, -0.07, 0)
  headGroup.add(nose)

  // Eyes
  const eyeGeo = new THREE.SphereGeometry(0.055, 5, 4)
  const eyeMatInst = new THREE.MeshPhongMaterial({ color: 0x111111, flatShading: true })
  const leftEye = new THREE.Mesh(eyeGeo, eyeMatInst)
  leftEye.position.set(0.23, 0.1, 0.21)
  headGroup.add(leftEye)

  const rightEye = new THREE.Mesh(eyeGeo, eyeMatInst)
  rightEye.position.set(0.23, 0.1, -0.21)
  headGroup.add(rightEye)

  // Floppy ears (hang down from top sides of head)
  const earGeo = new THREE.BoxGeometry(0.17, 0.35, 0.08)
  const leftEar = new THREE.Mesh(earGeo, mat())
  leftEar.position.set(-0.05, 0.1, 0.3)
  leftEar.rotation.z = 0.15
  headGroup.add(leftEar)

  const rightEar = new THREE.Mesh(earGeo, mat())
  rightEar.position.set(-0.05, 0.1, -0.3)
  rightEar.rotation.z = 0.15
  headGroup.add(rightEar)

  // ── Tail group (pivot at base so it wags) ────────────────────────────────
  const tailPivot = new THREE.Group()
  tailPivot.position.set(-0.58, 0.18, 0)
  dog.add(tailPivot)

  const tail = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.48, 0.11), mat())
  tail.position.set(0, 0.24, 0)   // offset so pivot is at the base
  tailPivot.add(tail)

  // Small tip on tail
  const tailTip = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.14, 0.09), mat())
  tailTip.position.set(0, 0.5, 0)
  tailPivot.add(tailTip)

  // ── Legs ─────────────────────────────────────────────────────────────────
  const legGeo = new THREE.BoxGeometry(0.17, 0.46, 0.17)
  const legPositions: [number, number, number][] = [
    [ 0.3,  -0.52,  0.19],
    [ 0.3,  -0.52, -0.19],
    [-0.3,  -0.52,  0.19],
    [-0.3,  -0.52, -0.19],
  ]
  for (const [x, y, z] of legPositions) {
    const leg = new THREE.Mesh(legGeo, mat())
    leg.position.set(x, y, z)
    dog.add(leg)
  }

  // Collect all meshes so we can update their colour each frame
  const meshes: THREE.Mesh[] = []
  dog.traverse((obj) => {
    if (obj instanceof THREE.Mesh && obj !== leftEye && obj !== rightEye && obj !== nose) {
      meshes.push(obj as THREE.Mesh)
    }
  })

  return { dog, tailPivot, headGroup, meshes }
}

export default function DogLogo({ size = 40 }: Props) {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(size, size)
    renderer.setClearColor(0x000000, 0)
    mount.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 100)
    camera.position.set(3.2, 1.9, 3.0)
    camera.lookAt(0.1, 0, 0)

    // Lights
    scene.add(new THREE.AmbientLight(0xffffff, 0.45))
    const key = new THREE.DirectionalLight(0xffffff, 1.5)
    key.position.set(4, 7, 5)
    scene.add(key)
    const fill = new THREE.DirectionalLight(0xffffff, 0.35)
    fill.position.set(-4, -2, 2)
    scene.add(fill)

    const { dog, tailPivot, headGroup, meshes } = buildDog()
    dog.rotation.y = 0.35   // slight 3-quarter angle
    scene.add(dog)

    let frameId: number
    let t = 0

    const animate = () => {
      frameId = requestAnimationFrame(animate)
      t += 0.045

      // Sync accent colour with theme
      const accent = getAccent()
      meshes.forEach((m) => (m.material as THREE.MeshPhongMaterial).color.setHex(accent))

      // Happy tail wag
      tailPivot.rotation.z = Math.sin(t * 5) * 0.45 + 0.25

      // Breathing body bob
      dog.position.y = Math.sin(t * 1.6) * 0.035

      // Curious head tilt — slow side-to-side
      headGroup.rotation.z = Math.sin(t * 0.7) * 0.07

      // Subtle yaw so the dog feels alive
      dog.rotation.y = 0.35 + Math.sin(t * 0.5) * 0.08

      renderer.render(scene, camera)
    }
    animate()

    return () => {
      cancelAnimationFrame(frameId)
      renderer.dispose()
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement)
    }
  }, [size])

  return <div ref={mountRef} style={{ width: size, height: size, display: "inline-block" }} />
}
