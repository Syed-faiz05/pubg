import { useCallback } from "react";
import Particles from "react-particles";
import { loadSlim } from "tsparticles-slim";

const ParticleBackground = () => {
    const particlesInit = useCallback(async (engine) => {
        await loadSlim(engine);
    }, []);

    return (
        <Particles
            id="tsparticles"
            init={particlesInit}
            options={{
                fullScreen: { enable: true, zIndex: -1 },
                background: { color: { value: "#020202" } },
                fpsLimit: 120,
                interactivity: {
                    events: {
                        onHover: { enable: true, mode: "grab" },
                        resize: true,
                    },
                    modes: {
                        grab: { distance: 200, links: { opacity: 0.5 } }, // Neural connection effect on hover
                    },
                },
                particles: {
                    color: { value: "#ffffff" },
                    links: {
                        color: "#ffffff",
                        distance: 120,
                        enable: true,
                        opacity: 0.08, // Very subtle lattice
                        width: 0.5,
                    },
                    move: {
                        enable: true,
                        speed: 0.6, // Slow, drifting movement
                        direction: "none",
                        random: false,
                        straight: false,
                        outModes: "out",
                    },
                    number: {
                        density: { enable: true, area: 1000 },
                        value: 80,
                    },
                    opacity: { value: 0.3 },
                    shape: { type: "circle" },
                    size: { value: { min: 1, max: 1.5 } }, // Tiny nodes
                },
                detectRetina: true,
            }}
        />
    );
};

export default ParticleBackground;
