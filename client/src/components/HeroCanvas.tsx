"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"

const PARTICLE_COUNT = 120
const CONNECTION_DISTANCE = 2.8
const SPREAD = 12

export default function HeroCanvas() {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(mount.clientWidth, mount.clientHeight)
    renderer.setClearColor(0x000000, 0)
    mount.appendChild(renderer.domElement)

    // Scene & camera
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(60, mount.clientWidth / mount.clientHeight, 0.1, 100)
    camera.position.z = 14

    // Detect accent color from CSS variable
    const getAccent = () => {
      const isDark = document.documentElement.classList.contains("dark")
      return isDark ? 0x800020 : 0x7B3B4B
    }

    // Particles
    const positions: THREE.Vector3[] = []
    const velocities: THREE.Vector3[] = []
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      positions.push(
        new THREE.Vector3(
          (Math.random() - 0.5) * SPREAD,
          (Math.random() - 0.5) * SPREAD,
          (Math.random() - 0.5) * 6,
        )
      )
      velocities.push(
        new THREE.Vector3(
          (Math.random() - 0.5) * 0.004,
          (Math.random() - 0.5) * 0.004,
          (Math.random() - 0.5) * 0.002,
        )
      )
    }

    const geo = new THREE.BufferGeometry()
    const posArray = new Float32Array(PARTICLE_COUNT * 3)
    positions.forEach((p, i) => { posArray[i * 3] = p.x; posArray[i * 3 + 1] = p.y; posArray[i * 3 + 2] = p.z })
    geo.setAttribute("position", new THREE.BufferAttribute(posArray, 3))

    const dotMat = new THREE.PointsMaterial({ color: getAccent(), size: 0.08, transparent: true, opacity: 0.85 })
    const dots = new THREE.Points(geo, dotMat)
    scene.add(dots)

    // Lines geometry (updated every frame)
    const maxLines = PARTICLE_COUNT * 4
    const linePositions = new Float32Array(maxLines * 2 * 3)
    const lineGeo = new THREE.BufferGeometry()
    lineGeo.setAttribute("position", new THREE.BufferAttribute(linePositions, 3))
    const lineMat = new THREE.LineSegments(
      lineGeo,
      new THREE.LineBasicMaterial({ color: getAccent(), transparent: true, opacity: 0.2 })
    )
    scene.add(lineMat)

    // Mouse parallax
    const mouse = { x: 0, y: 0 }
    const onMouseMove = (e: MouseEvent) => {
      mouse.x = (e.clientX / window.innerWidth - 0.5) * 0.5
      mouse.y = -(e.clientY / window.innerHeight - 0.5) * 0.5
    }
    window.addEventListener("mousemove", onMouseMove)

    // Resize
    const onResize = () => {
      if (!mount) return
      camera.aspect = mount.clientWidth / mount.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(mount.clientWidth, mount.clientHeight)
    }
    window.addEventListener("resize", onResize)

    // Animation
    let frameId: number
    const animate = () => {
      frameId = requestAnimationFrame(animate)

      // Update colors on theme change
      const accent = getAccent()
      dotMat.color.setHex(accent)
      ;(lineMat.material as THREE.LineBasicMaterial).color.setHex(accent)

      // Move particles
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        positions[i].add(velocities[i])
        if (Math.abs(positions[i].x) > SPREAD / 2) velocities[i].x *= -1
        if (Math.abs(positions[i].y) > SPREAD / 2) velocities[i].y *= -1
        if (Math.abs(positions[i].z) > 3) velocities[i].z *= -1
        posArray[i * 3] = positions[i].x
        posArray[i * 3 + 1] = positions[i].y
        posArray[i * 3 + 2] = positions[i].z
      }
      geo.attributes.position.needsUpdate = true

      // Build lines between close particles
      let lineCount = 0
      for (let i = 0; i < PARTICLE_COUNT && lineCount < maxLines - 1; i++) {
        for (let j = i + 1; j < PARTICLE_COUNT && lineCount < maxLines - 1; j++) {
          const dist = positions[i].distanceTo(positions[j])
          if (dist < CONNECTION_DISTANCE) {
            linePositions[lineCount * 6 + 0] = positions[i].x
            linePositions[lineCount * 6 + 1] = positions[i].y
            linePositions[lineCount * 6 + 2] = positions[i].z
            linePositions[lineCount * 6 + 3] = positions[j].x
            linePositions[lineCount * 6 + 4] = positions[j].y
            linePositions[lineCount * 6 + 5] = positions[j].z
            lineCount++
          }
        }
      }
      lineGeo.setDrawRange(0, lineCount * 2)
      lineGeo.attributes.position.needsUpdate = true

      // Parallax camera drift
      camera.position.x += (mouse.x - camera.position.x) * 0.03
      camera.position.y += (mouse.y - camera.position.y) * 0.03
      camera.lookAt(scene.position)

      renderer.render(scene, camera)
    }
    animate()

    return () => {
      cancelAnimationFrame(frameId)
      window.removeEventListener("mousemove", onMouseMove)
      window.removeEventListener("resize", onResize)
      renderer.dispose()
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement)
    }
  }, [])

  return <div ref={mountRef} className="absolute inset-0 w-full h-full" />
}
