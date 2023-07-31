import { FC, ReactNode, createContext, useState } from "react";

/**
 * interface for CommonContext
 * @property {string} feature
 * @property {void} change
 */

interface CommonContext {
  feature: string;
  change: (feature: string) => void;
}

// default value for context
const defaultValues = {
  feature: "chat",
  change: () => {},
};

// export feature context
export const FeatureContext = createContext<CommonContext>(defaultValues);

const FeatureProvider: FC<{ children: ReactNode }> = ({ children }) => {
  // state for feature
  const [feature, setFeature] = useState(defaultValues.feature);

  // void change
  const change = (feature: string) => {
    setFeature(feature);
  };

  // value dynamic 
  const featureDynamic = {
    feature,
    change,
  };
  
  return (
    <FeatureContext.Provider value={featureDynamic}>
      {children}
    </FeatureContext.Provider>
  );
};

export default FeatureProvider;
