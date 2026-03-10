"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"

function getAccent() {
  return document.documentElement.classList.contains("dark") ? 0x800020 : 0x7b3b4b
}

// Floor definitions: [width, depth, height]  — base first, spire last
const FLOOR_DEFS = [
  [2.6,  2.6,  0.22],   // 0 — wide base platform
  [2.15, 2.15, 0.42],   // 1
  [1.72, 1.72, 0.42],   // 2
  [1.32, 1.32, 0.42],   // 3
  [0.95, 0.95, 0.44],   // 4
  [0.62, 0.62, 0.54],   // 5 — narrow upper block
  [0.26, 0.26, 0.78],   // 6 — spire
] as const

// Build cumulative target Y positions (centre of each floor)
function buildTargetYs(): number[] {
  let y = 0
  return FLOOR_DEFS.map(([, , h]) => {
    const centre = y + h / 2
    y += h
    return centre
  }).map((cy) => cy - y / 2)   // centre the whole stack at Y=0
}

const TARGET_YS = buildTargetYs()
const FLOOR_COUNT = FLOOR_DEFS.length
const DROP_OFFSET = 6          // floors start this far below their target
const STAGGER_MS  = 180        // delay between each floor's animation start

export default function TowerCanvas() {
  const mountRef   = useRef<HTMLDivElement>(null)
  const builtRef   = useRef(false)  // prevent re-triggering

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    // ── Renderer ─────────────────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(mount.clientWidth, mount.clientHeight)
    renderer.setClearColor(0x000000, 0)
    mount.appendChild(renderer.domElement)

    // ── Scene / Camera ────────────────────────────────────────────────────────
    const scene  = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(42, mount.clientWidth / mount.clientHeight, 0.1, 100)
    camera.position.set(0, 1.2, 8)
    camera.lookAt(0, 0.3, 0)

    // ── Lights ────────────────────────────────────────────────────────────────
    scene.add(new THREE.AmbientLight(0xffffff, 0.4))
    const key = new THREE.DirectionalLight(0xffffff, 1.5)
    key.position.set(5, 8, 6)
    scene.add(key)
    const fill = new THREE.DirectionalLight(0xffffff, 0.3)
    fill.position.set(-4, -3, 2)
    scene.add(fill)
    const point = new THREE.PointLight(getAccent(), 3, 18)
    point.position.set(-3, 3, 4)
    scene.add(point)

    // ── Build floors ──────────────────────────────────────────────────────────
    const mat = new THREE.MeshPhongMaterial({
      color: getAccent(),
      flatShading: true,
      shininess: 35,
      specular: new THREE.Color(0xffffff),
    })
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x000000,
      wireframe: true,
      transparent: true,
      opacity: 0.14,
    })

    const towerGroup = new THREE.Group()
    scene.add(towerGroup)

    // currentY tracks where each floor actually is (starts dropped below target)
    const currentYs = TARGET_YS.map((ty) => ty - DROP_OFFSET)
    const active    = new Array(FLOOR_COUNT).fill(false)

    const floorMeshes = FLOOR_DEFS.map(([w, d, h], i) => {
      const geo   = new THREE.BoxGeometry(w, h, d)
      const mesh  = new THREE.Mesh(geo, mat)
      const wire  = new THREE.Mesh(geo, wireMat)
      const group = new THREE.Group()
      group.add(mesh, wire)
      group.position.y = currentYs[i]
      group.scale.set(1, 0.01, 1)   // start squished
      towerGroup.add(group)
      return group
    })

    // ── Scroll-driven reveal using IntersectionObserver ───────────────────────
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !builtRef.current) {
          builtRef.current = true
          floorMeshes.forEach((_, i) => {
            setTimeout(() => { active[i] = true }, i * STAGGER_MS)
          })
        }
      },
      { threshold: 0.25 }
    )
    observer.observe(mount)

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
      t += 0.018

      // Sync accent colour
      const accent = getAccent()
      mat.color.setHex(accent)
      point.color.setHex(accent)

      // Spring each floor to its target once activated
      for (let i = 0; i < FLOOR_COUNT; i++) {
        const floor = floorMeshes[i]
        if (active[i]) {
          // Spring position
          currentYs[i] += (TARGET_YS[i] - currentYs[i]) * 0.10
          floor.position.y = currentYs[i]

          // Spring scale (unsquish)
          const sy = floor.scale.y
          floor.scale.y += (1 - sy) * 0.10
        }
      }

      // Slow tower yaw + gentle bob
      const isBuilding = active.some(Boolean)
      towerGroup.rotation.y = isBuilding
        ? towerGroup.rotation.y + 0.006
        : 0
      towerGroup.position.y = Math.sin(t * 1.2) * 0.05

      renderer.render(scene, camera)
    }
    animate()

    return () => {
      cancelAnimationFrame(frameId)
      observer.disconnect()
      window.removeEventListener("resize", onResize)
      renderer.dispose()
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement)
    }
  }, [])

  return <div ref={mountRef} className="w-full h-full" />
}
