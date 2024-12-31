import { EXERCISES, SCHEMES, TEMPOS, WORKOUTS } from "./swoldier";

const exercises = flattenExercises(EXERCISES);

export function generateWorkout({ muscles, poison, goals }) {
    console.log("Inputs:", { muscles, poison, goals });

    // Input validation
    if (!Array.isArray(muscles) || muscles.length === 0) {
        console.error("Invalid or missing 'muscles'. Provide a non-empty array.");
        return [];
    }
    if (!SCHEMES[goals] || !SCHEMES[goals].ratio) {
        console.error(`Invalid goal: '${goals}'. Goal must exist in SCHEMES.`);
        return [];
    }

    const scheme = SCHEMES[goals];
    const ratio = scheme.ratio;

    // Determine the list of muscles to target
    const targetMuscles = poison === "individual"
        ? muscles
        : WORKOUTS[poison]?.[muscles[0]] || [];

    if (targetMuscles.length === 0) {
        console.error(`No valid muscles found for workout type '${poison}' and muscles '${muscles[0]}'.`);
        return [];
    }

    const shuffledMuscles = shuffleArray(targetMuscles);
    const muscleGroups = Array.from(new Set(shuffledMuscles));

    // Generate sets based on the scheme ratio
    const sets = ratio.reduce((acc, count, index) => {
        const setType = index === 0 ? "compound" : "accessory";
        const setsForType = Array(count).fill(setType);
        return acc.concat(setsForType);
    }, []);

    const structuredSets = sets.map((setType, index) => ({
        setType,
        muscleGroup: muscleGroups[index % muscleGroups.length],
    }));

    // Categorize exercises into compound and accessory
    const categorizedExercises = categorizeExercises(exercises, targetMuscles);

    // Generate the workout
    const workout = structuredSets.map(({ setType, muscleGroup }) =>
        selectExerciseForSet(setType, muscleGroup, categorizedExercises, scheme, TEMPOS)
    );

    // Filter out invalid entries
    return workout.filter((entry) => Object.keys(entry).length > 0);
}

function flattenExercises(exercisesObj) {
    const flattened = {};

    for (const [key, val] of Object.entries(exercisesObj)) {
        if (!val.variants) {
            flattened[key] = val;
        } else {
            for (const variant in val.variants) {
                const variantName = `${variant}_${key}`;
                flattened[variantName] = {
                    ...val,
                    description: `${val.description}___${val.variants[variant]}`,
                    substitutes: [...val.substitutes].slice(0, 5),
                };
            }
        }
    }
    return flattened;
}

function shuffleArray(array) {
    const shuffled = array.slice();
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

function categorizeExercises(exercises, targetMuscles) {
    return Object.keys(exercises).reduce(
        (acc, key) => {
            const exercise = exercises[key];
            const matchesTarget = exercise.muscles.some((muscle) =>
                targetMuscles.includes(muscle)
            );
            if (matchesTarget) {
                acc[exercise.type] = acc[exercise.type] || {};
                acc[exercise.type][key] = exercise;
            }
            return acc;
        },
        { compound: {}, accessory: {} }
    );
}

function selectExerciseForSet(setType, muscleGroup, exercises, scheme, tempos) {
    const availableExercises = exercises[setType];
    const candidates = Object.keys(availableExercises).filter(
        (key) => availableExercises[key].muscles.includes(muscleGroup)
    );

    const randomExerciseKey =
        candidates[Math.floor(Math.random() * candidates.length)];
    const randomExercise = availableExercises[randomExerciseKey];

    if (!randomExercise) return {};

    const repsOrDuration = calculateRepsOrDuration(
        randomExercise,
        scheme,
        setType
    );

    const tempo = tempos[Math.floor(Math.random() * tempos.length)];

    return {
        name: randomExerciseKey,
        tempo,
        reps: repsOrDuration,
        rest: scheme.rest[setType === "compound" ? 0 : 1],
        ...randomExercise,
    };
}

function calculateRepsOrDuration(exercise, scheme, setType) {
    const isReps = exercise.unit === "reps";
    const [min, max] = scheme.repRanges;

    if (isReps) {
        const baseReps = Math.floor(Math.random() * (max - min + 1)) + min;
        return setType === "accessory" ? baseReps + 4 : baseReps;
    }

    // For duration-based exercises
    const duration = Math.random() * 40 + 20;
    return Math.ceil(duration / 5) * 5; // Round to the nearest 5 seconds
}
