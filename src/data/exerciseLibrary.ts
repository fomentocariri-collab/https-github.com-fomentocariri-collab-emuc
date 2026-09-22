import { SongExercise } from "../types";
import { INICIANTED_EXERCISES } from "./inicianteExercises";
import { DA_CAPO_EXERCISES } from "./daCapoExercises";
import { ARBAN_EXERCISES } from "./arbanExercises";

export { INICIANTED_EXERCISES };
export const INTERMEDIARIO_EXERCISES: SongExercise[] = DA_CAPO_EXERCISES;
export const AVANCADO_EXERCISES: SongExercise[] = ARBAN_EXERCISES;
export { DA_CAPO_EXERCISES, ARBAN_EXERCISES };

export const ALL_EXERCISES: SongExercise[] = [
  ...INICIANTED_EXERCISES,
  ...INTERMEDIARIO_EXERCISES,
  ...AVANCADO_EXERCISES,
];
