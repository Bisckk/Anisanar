import { motion } from "framer-motion";
import "./Marquee.css";

export default function Marquee({
  children,
  direction = "left",
  speed = 40,
  pauseOnHover = true,
  className = "",
}) {
  return (
    <div className={`marquee-container ${className}`}>
      <motion.div
        className="marquee-content"
        animate={{
          x: direction === "left" ? ["0%", "-50%"] : ["-50%", "0%"],
        }}
        transition={{
          duration: speed,
          ease: "linear",
          repeat: Infinity,
        }}
        style={{
          display: "flex",
          width: "max-content",
        }}
        onHoverStart={pauseOnHover ? (e) => (e.target.style.animationPlayState = "paused") : undefined}
        onHoverEnd={pauseOnHover ? (e) => (e.target.style.animationPlayState = "running") : undefined}
      >
        <div className="marquee-item-wrapper">{children}</div>
        <div className="marquee-item-wrapper">{children}</div>
      </motion.div>
    </div>
  );
}
