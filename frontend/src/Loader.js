import React from "react";

export default function Loader() {
	return (
		<div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
			{[1, 2, 3].map((i) => (
				<div key={i} style={{ background: "#f3f3f3", borderRadius: 8, height: 80, marginBottom: 16, animation: "pulse 1.5s infinite" }} />
			))}
			<style>{`
				@keyframes pulse {
					0% { opacity: 1; }
					50% { opacity: 0.5; }
					100% { opacity: 1; }
				}
			`}</style>
		</div>
	);
}
