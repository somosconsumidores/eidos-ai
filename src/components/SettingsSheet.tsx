import { motion } from "framer-motion";
import { X, Sparkles, Palette, RotateCcw, Info } from "lucide-react";
import type { UserSettings } from "@/hooks/usePhotoStorage";

interface SettingsSheetProps {
  isOpen: boolean;
  onClose: () => void;
  settings: UserSettings;
  onUpdateSettings: (settings: Partial<UserSettings>) => void;
  onReset: () => void;
}

const archetypes = [
  {
    id: "classic" as const,
    label: "Clássico",
    description: "Proporções áureas tradicionais",
    icon: "✨",
    color: "from-amber-500 to-orange-600",
  },
  {
    id: "editorial" as const,
    label: "Editorial",
    description: "Look de alta moda e contraste",
    icon: "📸",
    color: "from-slate-400 to-slate-600",
  },
  {
    id: "natural" as const,
    label: "Natural",
    description: "Realce sutil e orgânico",
    icon: "🌿",
    color: "from-emerald-400 to-teal-600",
  },
];

const SettingsSheet = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  onReset,
}: SettingsSheetProps) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      {/* Sheet */}
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        className="fixed right-0 top-0 bottom-0 w-[85%] max-w-sm bg-background border-l border-border z-50 flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-12 pb-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="p-2 aurora-gradient rounded-xl">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-lg font-semibold text-foreground">Configurações</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-secondary rounded-xl transition-colors"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8">
          {/* Archetype Selection */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Palette className="w-4 h-4 text-aurora-mid" />
              <h3 className="text-sm font-medium text-foreground">
                Arquétipo de Beleza
              </h3>
            </div>

            <div className="space-y-3">
              {archetypes.map((arch) => (
                <motion.button
                  key={arch.id}
                  onClick={() => onUpdateSettings({ archetype: arch.id })}
                  className={`w-full p-4 rounded-2xl text-left transition-all border-2 ${
                    settings.archetype === arch.id
                      ? "border-aurora-mid bg-aurora-mid/10"
                      : "border-border bg-secondary/30 hover:border-muted-foreground/30"
                  }`}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{arch.icon}</span>
                    <div className="flex-1">
                      <span className="font-medium text-foreground block">
                        {arch.label}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {arch.description}
                      </span>
                    </div>
                    {settings.archetype === arch.id && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-5 h-5 aurora-gradient rounded-full flex items-center justify-center"
                      >
                        <div className="w-2 h-2 bg-white rounded-full" />
                      </motion.div>
                    )}
                  </div>
                </motion.button>
              ))}
            </div>
          </section>

          {/* Calibration Info */}
          <section className="glass rounded-2xl p-4">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-aurora-mid flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-foreground mb-1">
                  Sobre a Calibração
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Cada iteração do Bio-Template ajusta sutilmente os parâmetros
                  de correção facial. O arquétipo escolhido influencia o tipo
                  de harmonia aplicada às suas fotos.
                </p>
              </div>
            </div>
          </section>

          {/* Current Stats */}
          <section>
            <h3 className="text-sm font-medium text-foreground mb-3">
              Estatísticas
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="glass rounded-xl p-4 text-center">
                <span className="text-2xl font-bold text-gradient">
                  {settings.iterations}
                </span>
                <span className="text-xs text-muted-foreground block mt-1">
                  Iterações
                </span>
              </div>
              <div className="glass rounded-xl p-4 text-center">
                <span className="text-2xl font-bold text-foreground">
                  {archetypes.find((a) => a.id === settings.archetype)?.icon}
                </span>
                <span className="text-xs text-muted-foreground block mt-1">
                  Arquétipo
                </span>
              </div>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="px-6 py-6 border-t border-border">
          <button
            onClick={onReset}
            className="w-full py-3 glass rounded-xl flex items-center justify-center gap-2 text-destructive hover:bg-destructive/10 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="text-sm font-medium">Resetar Tudo</span>
          </button>
        </div>
      </motion.div>
    </>
  );
};

export default SettingsSheet;
