"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"

const GLOBE_R    = 2.2
const NODE_COUNT = 60
const PING_INTERVAL = 1.8   // seconds between each ping cycle

function getAccent() {
  return document.documentElement.classList.contains("dark") ? 0x800020 : 0x7b3b4b
}

/** Random point on unit sphere */
function randomSpherePoint(r: number): THREE.Vector3 {
  const u   = Math.random()
  const v   = Math.random()
  const lat = Math.acos(2 * u - 1) - Math.PI / 2
  const lon = 2 * Math.PI * v
  return new THREE.Vector3(
    r * Math.cos(lat) * Math.cos(lon),
    r * Math.sin(lat),
    r * Math.cos(lat) * Math.sin(lon)
  )
}

export default function GlobeCanvas() {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    // ── Renderer ──────────────────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(mount.clientWidth, mount.clientHeight)
    renderer.setClearColor(0x000000, 0)
    mount.appendChild(renderer.domElement)

    // ── Scene / camera ────────────────────────────────────────────────────────
    const scene  = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(42, mount.clientWidth / mount.clientHeight, 0.1, 100)
    camera.position.set(0, 0, 7.5)
    camera.lookAt(0, 0, 0)

    // ── Lights ────────────────────────────────────────────────────────────────
    scene.add(new THREE.AmbientLight(0xffffff, 0.5))
    const key = new THREE.DirectionalLight(0xffffff, 0.9)
    key.position.set(6, 8, 6)
    scene.add(key)

    // ── Master group — everything rotates together ────────────────────────────
    const group = new THREE.Group()
    scene.add(group)

    const accent = getAccent()

    // ── Globe shell (transparent) ─────────────────────────────────────────────
    const globeMat = new THREE.MeshPhongMaterial({
      color:       accent,
      transparent: true,
      opacity:     0.06,
      side:        THREE.FrontSide,
    })
    group.add(new THREE.Mesh(new THREE.SphereGeometry(GLOBE_R, 36, 36), globeMat))

    // ── Lat/lon wireframe ─────────────────────────────────────────────────────
    const wireMat = new THREE.MeshBasicMaterial({
      color:       accent,
      wireframe:   true,
      transparent: true,
      opacity:     0.10,
    })
    group.add(new THREE.Mesh(new THREE.SphereGeometry(GLOBE_R, 20, 14), wireMat))

    // ── Network nodes ─────────────────────────────────────────────────────────
    const nodePositions: THREE.Vector3[] = []
    const nodeMats:      THREE.MeshPhongMaterial[] = []

    const nodeGeo = new THREE.SphereGeometry(0.07, 7, 7)

    for (let i = 0; i < NODE_COUNT; i++) {
      const pos = randomSpherePoint(GLOBE_R + 0.04)
      nodePositions.push(pos)

      const mat = new THREE.MeshPhongMaterial({
        color:            accent,
        emissive:         new THREE.Color(accent),
        emissiveIntensity: 0.6,
      })
      nodeMats.push(mat)

      const node = new THREE.Mesh(nodeGeo, mat)
      node.position.copy(pos)
      group.add(node)
    }

    // ── Connection lines between nearby nodes ─────────────────────────────────
    const lineVerts: number[] = []
    for (let i = 0; i < NODE_COUNT; i++) {
      for (let j = i + 1; j < NODE_COUNT; j++) {
        if (nodePositions[i].distanceTo(nodePositions[j]) < 1.9) {
          lineVerts.push(
            nodePositions[i].x, nodePositions[i].y, nodePositions[i].z,
            nodePositions[j].x, nodePositions[j].y, nodePositions[j].z,
          )
        }
      }
    }
    const lineGeo = new THREE.BufferGeometry()
    lineGeo.setAttribute("position", new THREE.Float32BufferAttribute(lineVerts, 3))
    const lineMat = new THREE.LineBasicMaterial({
      color:       accent,
      transparent: true,
      opacity:     0.25,
    })
    group.add(new THREE.LineSegments(lineGeo, lineMat))

    // ── Ping rings — flat rings that expand & fade on the sphere surface ───────
    // Pick 8 evenly-spread "monitor" nodes
    const pingIndices = Array.from({ length: 8 }, (_, i) => Math.floor(i * NODE_COUNT / 8))

    interface Ping { ring: THREE.Mesh; mat: THREE.MeshBasicMaterial; phase: number }
    const pings: Ping[] = pingIndices.map((idx, i) => {
      const pos    = nodePositions[idx]
      const normal = pos.clone().normalize()

      const ringMat = new THREE.MeshBasicMaterial({
        color:       accent,
        transparent: true,
        opacity:     0,
        side:        THREE.DoubleSide,
      })
      const ring = new THREE.Mesh(new THREE.RingGeometry(0, 1, 28), ringMat)
      ring.position.copy(pos)
      // orient ring perpendicular to the sphere radius at this point
      ring.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), normal)
      ring.scale.setScalar(0.01)
      group.add(ring)
      return { ring, mat: ringMat, phase: i * (PING_INTERVAL / pingIndices.length) }
    })

    // ── Mouse parallax ────────────────────────────────────────────────────────
    const mouse = { x: 0, y: 0 }
    const onMouseMove = (e: MouseEvent) => {
      mouse.x =  (e.clientX / window.innerWidth  - 0.5) * 0.6
      mouse.y = -(e.clientY / window.innerHeight - 0.5) * 0.6
    }
    window.addEventListener("mousemove", onMouseMove)

    // ── Resize ────────────────────────────────────────────────────────────────
    const onResize = () => {
      if (!mount) return
      camera.aspect = mount.clientWidth / mount.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(mount.clientWidth, mount.clientHeight)
    }
    window.addEventListener("resize", onResize)

    // ── Animation loop ────────────────────────────────────────────────────────
    let frameId: number
    let t = 0

    const animate = () => {
      frameId = requestAnimationFrame(animate)
      t += 0.012

      // Sync accent colour
      const a = getAccent()
      globeMat.color.setHex(a)
      wireMat.color.setHex(a)
      lineMat.color.setHex(a)
      nodeMats.forEach((m) => {
        m.color.setHex(a)
        m.emissive.setHex(a)
      })
      pings.forEach(({ mat }) => mat.color.setHex(a))

      // Slow auto-rotation + mouse tilt
      group.rotation.y += 0.0025
      group.rotation.x += (mouse.y * 0.15 - group.rotation.x) * 0.04
      group.rotation.z += (mouse.x * 0.05 - group.rotation.z) * 0.04

      // Ping animations: ring grows from 0 → max radius, fades out
      pings.forEach(({ ring, mat, phase }) => {
        const cycle  = PING_INTERVAL          // seconds per full cycle
        const p      = ((t + phase) % cycle) / cycle   // 0 → 1
        const maxR   = 0.55
        const scale  = p * maxR
        ring.scale.setScalar(scale)
        mat.opacity  = p < 0.4 ? p * 1.5 : (1 - p) * 1.2
      })

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

  return <div ref={mountRef} className="w-full h-full" />
}
