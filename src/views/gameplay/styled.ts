import styled from 'styled-components';

export const Container = styled.div`
  width: 100%;
  height: 100vh;
  position: relative;
  overflow: hidden;
  background: #0e1014;
`;

export const Viewport = styled.canvas`
  display: block;
  width: 100%;
  height: 100%;
  image-rendering: pixelated;
`;

export const LoadingLabel = styled.span`
  position: absolute;
  top: 12px;
  left: 12px;
  color: #cfd9e2;
  font: 13px/1 ui-monospace, Consolas, monospace;
`;

export const HudFrame = styled.div`
  position: absolute;
  top: 12px;
  left: 12px;
  padding: 10px 12px;
  display: flex;
  gap: 18px;
  align-items: center;
  background: rgb(14 16 20 / 72%);
  border: 1px solid #2d3742;
  border-radius: 8px;
  color: #d2e3ec;
  font: 13px/1.2 ui-monospace, Consolas, monospace;
  backdrop-filter: blur(6px);
  pointer-events: none;
  user-select: none;
`;

export const HudCell = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;

  span:first-child {
    font-size: 10px;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: #6e7c8a;
  }

  span:last-child {
    font-size: 16px;
    color: #f5f5f5;
  }
`;

export const HudHint = styled.div`
  position: absolute;
  bottom: 12px;
  left: 50%;
  transform: translateX(-50%);
  padding: 6px 12px;
  background: rgb(14 16 20 / 65%);
  border: 1px solid #2d3742;
  border-radius: 6px;
  color: #98a8b5;
  font: 12px/1.2 ui-monospace, Consolas, monospace;
  pointer-events: none;
  user-select: none;
`;
