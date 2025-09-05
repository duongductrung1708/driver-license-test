import React from "react";
import { Box, Skeleton } from "@mui/material";

function FacebookSkeleton({ lines = 3, withAvatar = true }) {
  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        {withAvatar && (
          <Skeleton variant="circular" width={40} height={40} sx={{ mr: 2 }} />
        )}
        <Box sx={{ flex: 1 }}>
          <Skeleton variant="text" width="40%" height={20} />
          <Skeleton variant="text" width="25%" height={16} />
        </Box>
      </Box>
      {[...Array(lines)].map((_, idx) => (
        <Skeleton
          key={idx}
          variant="text"
          width={`${90 - idx * 10}%`}
          height={16}
        />
      ))}
      <Skeleton
        variant="rectangular"
        height={120}
        sx={{ mt: 2, borderRadius: 1 }}
      />
    </Box>
  );
}

export default FacebookSkeleton;
