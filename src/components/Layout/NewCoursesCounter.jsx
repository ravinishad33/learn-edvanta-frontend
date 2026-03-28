import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useState } from "react";

const NewCoursesCounter = ({ newlyAddedCount }) => {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const controls = animate(count, newlyAddedCount, {
      duration: 1.5,
      onUpdate: (latest) => setDisplay(Math.round(latest)),
    });

    return controls.stop; // cleanup
  }, [newlyAddedCount, count]);

  return (
    <span className="text-sm font-medium text-white">
      {display}+ New Courses Added
    </span>
  );
};

export default NewCoursesCounter;