import { Box, Text, useApp } from "ink";
import React, { useState } from "react";
import {
  type ApiProviderPreset,
  DEFAULT_PROVIDER_ID,
  defaultConfigPath,
  isPlausibleKey,
  redactKey,
  saveApiKeyForProvider,
} from "../../config.js";
import { t } from "../../i18n/index.js";
import { MaskedInput } from "./MaskedInput.js";
import { ProviderPicker } from "./ProviderPicker.js";
import { COLOR, GLYPH, GRADIENT } from "./theme.js";
import { FG } from "./theme/tokens.js";

export interface SetupProps {
  onReady: (apiKey: string) => void;
}

type SetupStep = "provider" | "apikey";

export function Setup({ onReady }: SetupProps) {
  const [step, setStep] = useState<SetupStep>("provider");
  const [selectedProvider, setSelectedProvider] = useState<ApiProviderPreset | null>(null);
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { exit } = useApp();

  const handleProviderChoose = (provider: ApiProviderPreset) => {
    setSelectedProvider(provider);
    setStep("apikey");
  };

  const handleSubmit = (raw: string) => {
    const trimmed = raw.trim();
    if (trimmed === "/exit" || trimmed === "/quit") {
      exit();
      return;
    }
    if (!isPlausibleKey(trimmed)) {
      setError(t("wizard.apiKeyInvalid"));
      setValue("");
      return;
    }
    try {
      const providerId = selectedProvider?.id ?? DEFAULT_PROVIDER_ID;
      saveApiKeyForProvider(providerId, trimmed);
    } catch (err) {
      setError(t("wizard.reviewSaveError", { message: (err as Error).message }));
      return;
    }
    onReady(trimmed);
  };

  if (step === "provider") {
    return <ProviderPicker onChoose={handleProviderChoose} onCancel={() => exit()} />;
  }

  return (
    <Box flexDirection="column" paddingX={1} marginY={1}>
      <Box>
        <Text bold color={GRADIENT[0]}>
          {GLYPH.brand}
        </Text>
        <Text>{"  "}</Text>
        <Text bold>{t("wizard.welcomeTitle")}</Text>
      </Box>
      <Box marginTop={1}>
        <Text color={COLOR.info}>{`提供商: ${selectedProvider?.name ?? "DeepSeek 官方"}`}</Text>
      </Box>
      <Box marginTop={1}>
        <Text color={COLOR.info}>{t("wizard.apiKeyPrompt")}</Text>
      </Box>
      <Box>
        <Text color={FG.faint}>{`  ${t("wizard.apiKeyGetOne")}`}</Text>
      </Box>
      <Box>
        <Text color={FG.faint}>
          {t("wizard.apiKeySavedLocally", { path: defaultConfigPath() })}
        </Text>
      </Box>
      <Box marginTop={1}>
        <Text bold color={COLOR.brand}>
          {GLYPH.bar}
        </Text>
        <Text bold color={COLOR.primary}>
          {" › "}
        </Text>
        <MaskedInput
          value={value}
          onChange={setValue}
          onSubmit={handleSubmit}
          mask="•"
          placeholder={t("wizard.apiKeyPlaceholder")}
        />
      </Box>
      {error ? (
        <Box marginTop={1}>
          <Text color={COLOR.err} bold>
            {GLYPH.err}
          </Text>
          <Text color={COLOR.err}>{`  ${error}`}</Text>
        </Box>
      ) : value ? (
        <Box marginTop={1}>
          <Text color={FG.faint}>{t("wizard.apiKeyPreview", { redacted: redactKey(value) })}</Text>
        </Box>
      ) : null}
      <Box marginTop={1}>
        <Text color={FG.faint}>{t("wizard.exitHint")}</Text>
      </Box>
    </Box>
  );
}
