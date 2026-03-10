"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"

export type StepShape = "crystal" | "torus"

interface Props {
  shape: StepShape
}

function buildGeometry(shape: StepShape): THREE.BufferGeometry {
  switch (shape) {
    case "crystal":
      return new THREE.IcosahedronGeometry(1.9, 1)
    case "torus":
      return new THREE.TorusGeometry(1.5, 0.58, 7, 14)
  }
}

function getAccent() {
  return document.documentElement.classList.contains("dark") ? 0x800020 : 0x7b3b4b
}

export default function StepCanvas({ shape }: Props) {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    const w = mount.clientWidth
    const h = mount.clientHeight

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(w, h)
    renderer.setClearColor(0x000000, 0)
    mount.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(50, w / h, 0.1, 100)
    camera.position.z = 6

    // Lights
    const ambient = new THREE.AmbientLight(0xffffff, 0.35)
    scene.add(ambient)

    const key = new THREE.DirectionalLight(0xffffff, 1.2)
    key.position.set(4, 6, 5)
    scene.add(key)

    const fill = new THREE.DirectionalLight(0xffffff, 0.4)
    fill.position.set(-4, -3, 2)
    scene.add(fill)

    // Accent point light — same color as shape
    const pointLight = new THREE.PointLight(getAccent(), 2.5, 12)
    pointLight.position.set(-3, 3, 3)
    scene.add(pointLight)

    // Main mesh (flat-shaded for the faceted look)
    const geo = buildGeometry(shape)
    const mat = new THREE.MeshPhongMaterial({
      color: getAccent(),
      flatShading: true,
      shininess: 40,
      specular: new THREE.Color(0xffffff),
    })
    const mesh = new THREE.Mesh(geo, mat)
    scene.add(mesh)

    // Wireframe overlay for the edge lines
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x000000,
      wireframe: true,
      opacity: 0.18,
      transparent: true,
    })
    const wire = new THREE.Mesh(geo, wireMat)
    scene.add(wire)

    // Mouse parallax
    const mouse = { x: 0, y: 0 }
    const onMouseMove = (e: MouseEvent) => {
      mouse.x = (e.clientX / window.innerWidth - 0.5) * 1.2
      mouse.y = -(e.clientY / window.innerHeight - 0.5) * 1.2
    }
    window.addEventListener("mousemove", onMouseMove)

    // Resize
    const onResize = () => {
      if (!mount) return
      const nw = mount.clientWidth
      const nh = mount.clientHeight
      camera.aspect = nw / nh
      camera.updateProjectionMatrix()
      renderer.setSize(nw, nh)
    }
    window.addEventListener("resize", onResize)

    let frameId: number
    const animate = () => {
      frameId = requestAnimationFrame(animate)

      // Sync accent colour on theme toggle
      const accent = getAccent()
      mat.color.setHex(accent)
      pointLight.color.setHex(accent)

      mesh.rotation.x += 0.004
      mesh.rotation.y += 0.007
      wire.rotation.copy(mesh.rotation)

      // Gentle mouse-driven tilt
      mesh.rotation.x += (mouse.y * 0.05 - mesh.rotation.x) * 0.02
      mesh.rotation.y += (mouse.x * 0.05 - mesh.rotation.y) * 0.02

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
  }, [shape])

  return <div ref={mountRef} className="w-full h-full" />
}
