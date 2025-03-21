
interface NutritionalInfoProps {
  nutritionalInfo: {
    calories: number;
    fat: number;
    carbs: number;
    protein: number;
  };
}

export default function NutritionalInfo({ nutritionalInfo }: NutritionalInfoProps) {
  return (
    <>
      <h3 className="text-lg font-semibold mb-2">Nutritional Information</h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
        <div className="text-center p-2 rounded-lg bg-muted">
          <p className="text-sm text-muted-foreground">Calories</p>
          <p className="font-semibold">{nutritionalInfo.calories}</p>
        </div>
        <div className="text-center p-2 rounded-lg bg-muted">
          <p className="text-sm text-muted-foreground">Fat</p>
          <p className="font-semibold">{nutritionalInfo.fat}g</p>
        </div>
        <div className="text-center p-2 rounded-lg bg-muted">
          <p className="text-sm text-muted-foreground">Carbs</p>
          <p className="font-semibold">{nutritionalInfo.carbs}g</p>
        </div>
        <div className="text-center p-2 rounded-lg bg-muted">
          <p className="text-sm text-muted-foreground">Protein</p>
          <p className="font-semibold">{nutritionalInfo.protein}g</p>
        </div>
      </div>
    </>
  );
}
