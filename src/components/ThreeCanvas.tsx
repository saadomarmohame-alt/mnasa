import { useEffect, useRef } from 'react';

export default function ThreeCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    // Mouse coordinates tracker
    const mouse = { x: width / 2, y: height / 2, targetX: width / 2, targetY: height / 2, speed: 0.08 };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.targetX = e.clientX - rect.left;
      mouse.targetY = e.clientY - rect.top;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Dynamic resizing observer
    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener('resize', handleResize);

    // 3D Point Structure
    interface Point3D {
      x: number;
      y: number;
      z: number;
      origX: number;
      origY: number;
      origZ: number;
      color: string;
      radius: number;
    }

    const points: Point3D[] = [];
    const pointCount = 120;
    const sphereRadius = Math.min(width, height) * 0.28 || 180;

    // Build a beautiful double-helix / globe shell
    for (let i = 0; i < pointCount; i++) {
      const theta = Math.acos(-1 + (2 * i) / pointCount);
      const phi = Math.sqrt(pointCount * Math.PI) * theta;

      const x = sphereRadius * Math.sin(theta) * Math.cos(phi);
      const y = sphereRadius * Math.sin(theta) * Math.sin(phi);
      const z = sphereRadius * Math.cos(theta);

      // Cyberpunk glowing colors
      const color =
        i % 4 === 0
          ? 'rgba(0, 242, 254, 0.8)' // Cyan glow
          : i % 4 === 1
          ? 'rgba(238, 9, 121, 0.8)' // Hot Pink
          : i % 4 === 2
          ? 'rgba(255, 117, 0, 0.8)' // Amber gold
          : 'rgba(128, 90, 213, 0.8)'; // Neon Purple

      points.push({
        x,
        y,
        z,
        origX: x,
        origY: y,
        origZ: z,
        color,
        radius: Math.random() * 2 + 1,
      });
    }

    // Camera parameters
    const fov = 350;
    let angleX = 0.0012; // Slow perpetual rotation speeds
    let angleY = 0.0015;
    let angleZ = 0.0007;

    const rotate3D = (point: Point3D, ax: number, ay: number, az: number) => {
      // Rotate around X
      let y1 = point.y * Math.cos(ax) - point.z * Math.sin(ax);
      let z1 = point.y * Math.sin(ax) + point.z * Math.cos(ax);

      // Rotate around Y
      let x2 = point.x * Math.cos(ay) + z1 * Math.sin(ay);
      let z2 = -point.x * Math.sin(ay) + z1 * Math.cos(ay);

      // Rotate around Z
      let x3 = x2 * Math.cos(az) - y1 * Math.sin(az);
      let y3 = x2 * Math.sin(az) + y1 * Math.cos(az);

      point.x = x3;
      point.y = y3;
      point.z = z2;
    };

    // Render loop
    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // Update Mouse movements with spring easing
      mouse.x += (mouse.targetX - mouse.x) * mouse.speed;
      mouse.y += (mouse.targetY - mouse.y) * mouse.speed;

      // Adjust rotation speed depending on mouse offset to simulate gravity drag!
      const dragFactorX = (mouse.x - width / 2) * 0.00001;
      const dragFactorY = (mouse.y - height / 2) * 0.00001;

      // Draw faint deep futuristic background net grid
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.02)';
      ctx.lineWidth = 0.5;
      const gridSize = 80;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Draw futuristic orbital luxury background arcs
      ctx.strokeStyle = 'rgba(0, 242, 254, 0.04)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(width / 2 + (mouse.x - width / 2) * 0.1, height / 2 + (mouse.y - height / 2) * 0.1, sphereRadius * 1.5, 0, Math.PI * 2);
      ctx.stroke();

      ctx.strokeStyle = 'rgba(238, 9, 121, 0.03)';
      ctx.beginPath();
      ctx.arc(width / 2 - (mouse.x - width / 2) * 0.1, height / 2 - (mouse.y - height / 2) * 0.1, sphereRadius * 2, 0, Math.PI * 2);
      ctx.stroke();

      // Sort points by depth (Z) to render further points first (painters algorithm)
      points.sort((a, b) => b.z - a.z);

      points.forEach((p) => {
        // Rotate points
        rotate3D(p, angleX + dragFactorY, angleY + dragFactorX, angleZ);

        // Map 3D coordinates into 2D screen projections with perspective projection
        const scale = fov / (fov + p.z);
        const projX = p.x * scale + width / 2;
        const projY = p.y * scale + height / 2;

        // Interactive mouse magnetic pulling force!
        const dx = mouse.x - projX;
        const dy = mouse.y - projY;
        const dist = Math.hypot(dx, dy);
        let finalX = projX;
        let finalY = projY;

        if (dist < 140) {
          const pull = (140 - dist) * 0.08;
          finalX -= (dx / dist) * pull;
          finalY -= (dy / dist) * pull;
        }

        // Render connected neural lasers to neighboring nodes (within range)
        points.forEach((otherP) => {
          if (p === otherP) return;
          const otherScale = fov / (fov + otherP.z);
          const otherProjX = otherP.x * otherScale + width / 2;
          const otherProjY = otherP.y * otherScale + height / 2;

          const dxO = otherProjX - projX;
          const dyO = otherProjY - projY;
          const distNodes = Math.hypot(dxO, dyO);

          // Connect points that are depth-friendly and coordinate close
          if (distNodes < 90 && Math.abs(p.z - otherP.z) < 100) {
            const alpha = (1 - distNodes / 90) * 0.15;
            ctx.strokeStyle = p.color.replace('0.8', alpha.toFixed(2));
            ctx.lineWidth = 0.6 * scale;
            ctx.beginPath();
            ctx.moveTo(finalX, finalY);
            ctx.lineTo(otherProjX, otherProjY);
            ctx.stroke();
          }
        });

        // Draw particle nodes with dynamic styling glow
        const particleOpacity = Math.max(0.1, Math.min(1, scale * 0.8));
        ctx.fillStyle = p.color.replace('0.8', particleOpacity.toFixed(2));

        ctx.beginPath();
        ctx.arc(finalX, finalY, p.radius * scale, 0, Math.PI * 2);
        ctx.fill();

        // Node specular glow highlighting
        if (scale > 1.2) {
          ctx.shadowColor = p.color;
          ctx.shadowBlur = 12;
          ctx.beginPath();
          ctx.arc(finalX, finalY, p.radius * scale * 1.5, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
          ctx.fill();
          ctx.shadowBlur = 0; // reset
        }
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-auto bg-transparent z-0 overflow-hidden"
      style={{ touchAction: 'none' }}
    />
  );
}
