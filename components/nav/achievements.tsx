import clsx from "clsx/lite"
import { Achievement, ACHIEVEMENT_CONFIG } from "../../gameconfig/achievements"
import { useAppSelector } from "../../redux/hooks"
import { selectUnlockedAchievements } from "../../redux/statsSlice"
import { useState } from "react"
import { achievementSelectorMap } from "../../redux/shared/helpers"
import { selectAchievementModifier } from "../../redux/playerSlice"

export default function Achievements() {
  const unlockedAchievements = useAppSelector(selectUnlockedAchievements)
  const achievementModifier = useAppSelector(selectAchievementModifier)

  const [selectedAchievement, setSelectedAchievement] = useState<false | Achievement>(false)

  function onViewAchievement(Achievement: Achievement) {
    setSelectedAchievement(Achievement)
  }

  const achievementProgress = useAppSelector((state) => {
    if (!selectedAchievement) return 0
    return achievementSelectorMap[selectedAchievement.id.split(".")[0]](state)
  })

  const isAchievementUnlocked = (id: string) => unlockedAchievements.includes(id)
  const formatFeature = (word: string) => word.charAt(0).toUpperCase() + word.slice(1)
  const formatCategory = (id: string) => id.charAt(0).toUpperCase() + id.slice(1)

  return (
    <div className="flex flex-col h-full text-lg relative">
      {unlockedAchievements.length > 0 && (
        <div className="w-full text-center mb-6 text-xl text-white flex-none">
          {" "}
          Your <span className="font-bold text-gold">{unlockedAchievements.length}</span> Achievements increase your
          damage dealt by <span className="font-bold text-green-500">{Math.round(achievementModifier * 100)}%</span>
        </div>
      )}

      <div id="achievements-cont" className="flex-1 min-h-0 overflow-y-auto border-t border-lightgold pt-2">
        {Object.entries(ACHIEVEMENT_CONFIG).map(([feature, categories]) => (
          // Achievement pane

          <div id="achievement-cont" key={`${feature}-container`} className="flex flex-col pb-2">
            <div
              id="feature-category:achievement-grid"
              className="grid grid-cols-[100px_1fr] md:grid-cols-[100px_1fr] lg:grid-cols-[150px_1fr] xl:grid-cols-[200px_1fr] gap-4 border-b border-lightgold font-paytone text-white">
              <h2 className="place-self-center font-bold text-4xl">{formatFeature(feature)}</h2>
              <div id="category-achievement-cont" className="flex flex-col gap-2 mb-2">
                {Object.entries(categories).map(([category, achievements]) => (
                  // Category title: Achievement grid

                  <div
                    id="category:achievement"
                    key={`${feature}-${category}`}
                    className="grid grid-row md:grid-cols-[100px_1fr] lg:grid-cols-[150px_1fr] xl:grid-cols-[200px_1fr] gap-4">
                    <h3 className="text-center md:text-left">{formatCategory(category)}</h3>
                    <div id="achievements-for-category" className="flex flex-wrap gap-2">
                      {achievements.map((achievement) => {
                        // Grid items

                        const unlocked = isAchievementUnlocked(achievement.id)
                        return (
                          <div
                            key={achievement.id}
                            className={clsx(
                              "h-9 w-16 ",
                              unlocked
                                ? "rounded-sm border-gold bg-[linear-gradient(117deg,_rgba(191,149,63,1)_0%,_rgba(170,119,28,1)_18%,_rgba(227,168,18,1)_64%,_rgba(252,246,186,1)_100%)]"
                                : "border-2 border-white/60 bg-black/60",
                            )}
                            onPointerOver={() => onViewAchievement(achievement)}
                            onMouseLeave={() => setSelectedAchievement(false)}></div>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
      {selectedAchievement && ( // Achievement details overlay
        <div
          id="achievement-tooltip-overlay"
          className="min-h-[25%] md:h-[15%] absolute pointer-events-none bottom-0 left-0 right-0 bg-[radial-gradient(circle,_rgba(189,189,189,1)_0%,_rgba(179,179,179,1)_81%,_rgba(219,217,217,1)_100%)] rounded-b-[8px] border-t-4 border-darkgold -m-5">
          <div className="relative flex justify-center items-center">
            <h2 className="px-2 text-3xl font-passion">{selectedAchievement.title}</h2>
            {isAchievementUnlocked(selectedAchievement.id) && ( // Unlocked text top-right if desktop
              <p className="hidden md:block absolute right-2 font-extrabold text-xl bg-gradient-to-r from-yellow-600 via-amber-500 to-yellow-600 inline-block bg-clip-text text-transparent">
                UNLOCKED
              </p>
            )}
          </div>

          {/* Description & current progress */}
          <div className="flex flex-col gap-2 mt-1 mx-2">
            <div className="relative flex justify-between">
              <p className="text-2xl text-center font-passion">{selectedAchievement.description}</p>
              <p className="text-lg font-paytone">
                <span className={clsx(isAchievementUnlocked(selectedAchievement.id) && "text-islam")}>
                  {achievementProgress.toLocaleString()}/{selectedAchievement.condition.toLocaleString()}
                </span>
              </p>
            </div>

            {/* Reward & UNLOCKED text if mobile */}
            <div className="relative flex justify-between items-center">
              <div>
                {isAchievementUnlocked(selectedAchievement.id) && (
                  <p className="block md:hidden font-extrabold text-xl bg-gradient-to-r from-yellow-600 via-amber-500 to-yellow-600 inline-block bg-clip-text text-transparent">
                    UNLOCKED
                  </p>
                )}
              </div>
              <div>
                <p className="text-lg text-right text-islam">+{selectedAchievement.modifier * 100}%</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
