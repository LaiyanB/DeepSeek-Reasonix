import { Box, Text } from "ink";
import React, { useState } from "react";
import { API_PROVIDER_PRESETS, type ApiProviderPreset } from "../../config.js";
import { useKeystroke } from "./keystroke-context.js";
import { COLOR, GLYPH } from "./theme.js";
import { FG } from "./theme/tokens.js";

export interface ProviderPickerProps {
  current?: string;
  onChoose: (provider: ApiProviderPreset) => void;
  onCancel: () => void;
}

export function ProviderPicker({ current, onChoose, onCancel }: ProviderPickerProps) {
  const [focus, setFocus] = useState(() => {
    const idx = API_PROVIDER_PRESETS.findIndex((p) => p.id === current);
    return idx >= 0 ? idx : 0;
  });

  useKeystroke((ev) => {
    if (ev.escape) return onCancel();
    if (ev.upArrow) return setFocus((f) => Math.max(0, f - 1));
    if (ev.downArrow) return setFocus((f) => Math.min(API_PROVIDER_PRESETS.length - 1, f + 1));
    if (ev.return) {
      return onChoose(API_PROVIDER_PRESETS[focus]!);
    }
  });

  return (
    <Box flexDirection="column" paddingX={1} marginY={1}>
      <Box>
        <Text bold color={COLOR.brand}>
          {GLYPH.brand}
        </Text>
        <Text>{"  "}</Text>
        <Text bold>选择 API 提供商</Text>
      </Box>
      <Box marginTop={1}>
        <Text color={FG.faint}>所有提供商都兼容 DeepSeek API，选择一个即可</Text>
      </Box>
      <Box height={1} />
      {API_PROVIDER_PRESETS.map((provider, i) => {
        const focused = i === focus;
        const active = provider.id === current;
        return (
          <Box key={provider.id}>
            <Text color={focused ? COLOR.primary : FG.faint}>{focused ? " › " : "   "}</Text>
            <Text bold={focused} color={active ? COLOR.brand : undefined}>
              {provider.name}
            </Text>
            <Text color={FG.faint}>{` — ${provider.description}`}</Text>
          </Box>
        );
      })}
      <Box marginTop={1}>
        <Text color={FG.faint}>↑↓ 选择 | Enter 确认 | Esc 取消</Text>
      </Box>
    </Box>
  );
}
