-- AlterTable
ALTER TABLE "User" ADD COLUMN     "githubProfileUrl" TEXT,
ADD COLUMN     "githubToken" TEXT,
ADD COLUMN     "githubUsername" TEXT;

-- CreateTable
CREATE TABLE "CareerDNA" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "learningStyle" TEXT NOT NULL,
    "timeAvailable" TEXT NOT NULL,
    "budget" INTEGER NOT NULL,
    "preferredPace" TEXT NOT NULL,
    "motivation" TEXT NOT NULL,
    "currentLevel" TEXT NOT NULL,
    "avgCompletionRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "preferredFormat" TEXT NOT NULL,
    "bestLearningTime" TEXT NOT NULL,
    "targetRole" TEXT,
    "targetCompany" TEXT,
    "timelineWeeks" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CareerDNA_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LearningResource" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "thumbnailUrl" TEXT,
    "type" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "skillTags" TEXT NOT NULL,
    "difficulty" TEXT NOT NULL,
    "duration" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "rating" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "reviewCount" INTEGER NOT NULL DEFAULT 0,
    "completionCount" INTEGER NOT NULL DEFAULT 0,
    "avgCompletionRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "provider" TEXT NOT NULL,
    "authorName" TEXT,
    "trendingScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "qualityScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "relevanceScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LearningResource_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserResourceProgress" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "resourceId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "progressPercent" INTEGER NOT NULL DEFAULT 0,
    "timeSpent" INTEGER NOT NULL DEFAULT 0,
    "liked" BOOLEAN NOT NULL DEFAULT false,
    "bookmarked" BOOLEAN NOT NULL DEFAULT false,
    "rating" INTEGER,
    "review" TEXT,
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "lastAccessedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserResourceProgress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LearningPath" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "targetRole" TEXT NOT NULL,
    "resources" TEXT NOT NULL,
    "estimatedWeeks" INTEGER NOT NULL,
    "totalHours" INTEGER NOT NULL,
    "currentStep" INTEGER NOT NULL DEFAULT 0,
    "completedSteps" INTEGER NOT NULL DEFAULT 0,
    "progressPercent" INTEGER NOT NULL DEFAULT 0,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "isAIGenerated" BOOLEAN NOT NULL DEFAULT false,
    "difficulty" TEXT NOT NULL,
    "enrolledCount" INTEGER NOT NULL DEFAULT 0,
    "completionRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LearningPath_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MicroOpportunity" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "requiredSkills" TEXT NOT NULL,
    "difficulty" TEXT NOT NULL,
    "estimatedHours" INTEGER NOT NULL,
    "compensation" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "compensationType" TEXT NOT NULL,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "maxParticipants" INTEGER,
    "currentParticipants" INTEGER NOT NULL DEFAULT 0,
    "providerName" TEXT NOT NULL,
    "providerAvatar" TEXT,
    "providerRating" DOUBLE PRECISION,
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MicroOpportunity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LearningStreak" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "currentStreak" INTEGER NOT NULL DEFAULT 0,
    "longestStreak" INTEGER NOT NULL DEFAULT 0,
    "totalDays" INTEGER NOT NULL DEFAULT 0,
    "lastActivityDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "monthlyHours" INTEGER NOT NULL DEFAULT 0,
    "monthlyResources" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LearningStreak_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LearningAchievement" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "achievementType" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "earnedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isShared" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "LearningAchievement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ResourceFeedback" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "resourceId" TEXT NOT NULL,
    "feedbackType" TEXT NOT NULL,
    "reason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ResourceFeedback_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuantumLearningState" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "brainWavePattern" TEXT NOT NULL,
    "cognitiveLoad" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "focusIntensity" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "creativityIndex" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "futureSelfProjection" TEXT NOT NULL,
    "careerTrajectory" TEXT NOT NULL,
    "skillDecayRate" TEXT NOT NULL,
    "emergingSkillsRadar" TEXT NOT NULL,
    "parallelUniversePaths" TEXT NOT NULL,
    "retroactiveSkillGaps" TEXT NOT NULL,
    "futureJobMarketFit" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "optimalLearningWindows" TEXT NOT NULL,
    "memoryRetentionRate" DOUBLE PRECISION NOT NULL DEFAULT 85,
    "neuralPlasticity" DOUBLE PRECISION NOT NULL DEFAULT 75,
    "lastQuantumScan" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "QuantumLearningState_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AIPersona" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "personaName" TEXT NOT NULL,
    "avatarUrl" TEXT,
    "voiceSignature" TEXT,
    "learningDNA" TEXT NOT NULL,
    "thoughtProcess" TEXT NOT NULL,
    "decisionMatrix" TEXT NOT NULL,
    "nextSkillPrediction" TEXT NOT NULL,
    "jobSwitchProbability" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "burnoutRiskScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "alternateCareerSelves" TEXT NOT NULL,
    "skillPersonalityMatch" TEXT NOT NULL,
    "mentorPersonality" TEXT NOT NULL,
    "teachingStyle" TEXT NOT NULL,
    "motivationTriggers" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AIPersona_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BrainSyncSession" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "resourceId" TEXT,
    "sessionType" TEXT NOT NULL,
    "brainwaveData" TEXT NOT NULL,
    "focusScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "comprehensionRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "neuralPathways" TEXT NOT NULL,
    "synapticStrength" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "memoryConsolidation" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "flowStateAchieved" BOOLEAN NOT NULL DEFAULT false,
    "flowStateDuration" INTEGER NOT NULL DEFAULT 0,
    "distractionCount" INTEGER NOT NULL DEFAULT 0,
    "learningVelocity" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "informationDensity" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "heartRateAvg" INTEGER,
    "stressLevel" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "energyLevel" DOUBLE PRECISION NOT NULL DEFAULT 100,
    "sessionDuration" INTEGER NOT NULL DEFAULT 0,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BrainSyncSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SkillEvolutionTimeline" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "skillName" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "proficiencyHistory" TEXT NOT NULL,
    "currentLevel" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "peakLevel" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "decayRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "projectedLevel6Mo" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "projectedLevel1Yr" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "projectedLevel5Yr" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "marketDemand" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "futureDemand2030" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "salaryImpact" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "hoursInvested" INTEGER NOT NULL DEFAULT 0,
    "learningEfficiency" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "retentionRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "prerequisiteSkills" TEXT NOT NULL,
    "synergisticSkills" TEXT NOT NULL,
    "competingSkills" TEXT NOT NULL,
    "firstLearnedAt" TIMESTAMP(3),
    "lastPracticedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SkillEvolutionTimeline_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CollectiveIntelligence" (
    "id" TEXT NOT NULL,
    "topicCluster" TEXT NOT NULL,
    "optimalLearningPath" TEXT NOT NULL,
    "commonPitfalls" TEXT NOT NULL,
    "breakthroughMoments" TEXT NOT NULL,
    "averageTimeToMaster" INTEGER NOT NULL DEFAULT 0,
    "successRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "dropoutRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "winningStrategies" TEXT NOT NULL,
    "resourceCombinations" TEXT NOT NULL,
    "studyPatterns" TEXT NOT NULL,
    "currentLearners" INTEGER NOT NULL DEFAULT 0,
    "trendingMomentum" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "nextHotTopic" TEXT,
    "decliningRelevance" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "participantCount" INTEGER NOT NULL DEFAULT 0,
    "lastUpdated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CollectiveIntelligence_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NeuralRecommendation" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "recommendationType" TEXT NOT NULL,
    "confidenceScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "reasoningChain" TEXT NOT NULL,
    "alternativeOptions" TEXT NOT NULL,
    "expectedROI" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "careerImpact" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "timeToImpact" INTEGER NOT NULL DEFAULT 0,
    "urgencyLevel" TEXT NOT NULL,
    "windowOfOpportunity" INTEGER,
    "competitorAnalysis" TEXT NOT NULL,
    "personalizedReason" TEXT NOT NULL,
    "successProbability" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "actionSteps" TEXT NOT NULL,
    "resourcesNeeded" TEXT NOT NULL,
    "estimatedCost" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "estimatedHours" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "userFeedback" TEXT,
    "actualOutcome" TEXT,
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NeuralRecommendation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FutureSelfSimulation" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "simulationDate" TIMESTAMP(3) NOT NULL,
    "projectedRole" TEXT NOT NULL,
    "projectedCompany" TEXT,
    "projectedSalary" DOUBLE PRECISION,
    "projectedLocation" TEXT,
    "skillsAcquired" TEXT NOT NULL,
    "skillsObsolete" TEXT NOT NULL,
    "satisfactionScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "workLifeBalance" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "stressLevel" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "majorMilestones" TEXT NOT NULL,
    "careerHighlights" TEXT NOT NULL,
    "bestCaseScenario" TEXT NOT NULL,
    "worstCaseScenario" TEXT NOT NULL,
    "mostLikelyPath" TEXT NOT NULL,
    "keyDecisions" TEXT NOT NULL,
    "pivotPoints" TEXT NOT NULL,
    "accuracyScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FutureSelfSimulation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmotionalIntelligenceProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "learningEmotions" TEXT NOT NULL,
    "stressTriggers" TEXT NOT NULL,
    "motivationDrivers" TEXT NOT NULL,
    "procrastinationPattern" TEXT NOT NULL,
    "peakProductivityTime" TEXT NOT NULL,
    "burnoutWarnings" TEXT NOT NULL,
    "collaborationStyle" TEXT NOT NULL,
    "feedbackPreference" TEXT NOT NULL,
    "failureRecoveryRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "persistenceScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "adaptabilityScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "mindsetScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "challengeSeekingBehavior" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "lastAnalysis" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EmotionalIntelligenceProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SkillMarketplaceTrade" (
    "id" TEXT NOT NULL,
    "offererId" TEXT NOT NULL,
    "receiverId" TEXT,
    "skillOffered" TEXT NOT NULL,
    "skillRequested" TEXT NOT NULL,
    "tradeType" TEXT NOT NULL,
    "sessionCount" INTEGER NOT NULL DEFAULT 1,
    "hoursPerSession" INTEGER NOT NULL DEFAULT 1,
    "skillValueMatch" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "marketValue" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'open',
    "offererRating" DOUBLE PRECISION,
    "receiverRating" DOUBLE PRECISION,
    "feedback" TEXT,
    "matchedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SkillMarketplaceTrade_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CareerDNA_userId_idx" ON "CareerDNA"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "CareerDNA_userId_key" ON "CareerDNA"("userId");

-- CreateIndex
CREATE INDEX "LearningResource_type_idx" ON "LearningResource"("type");

-- CreateIndex
CREATE INDEX "LearningResource_category_idx" ON "LearningResource"("category");

-- CreateIndex
CREATE INDEX "LearningResource_difficulty_idx" ON "LearningResource"("difficulty");

-- CreateIndex
CREATE INDEX "LearningResource_rating_idx" ON "LearningResource"("rating");

-- CreateIndex
CREATE INDEX "LearningResource_trendingScore_idx" ON "LearningResource"("trendingScore");

-- CreateIndex
CREATE INDEX "UserResourceProgress_userId_idx" ON "UserResourceProgress"("userId");

-- CreateIndex
CREATE INDEX "UserResourceProgress_status_idx" ON "UserResourceProgress"("status");

-- CreateIndex
CREATE INDEX "UserResourceProgress_bookmarked_idx" ON "UserResourceProgress"("bookmarked");

-- CreateIndex
CREATE UNIQUE INDEX "UserResourceProgress_userId_resourceId_key" ON "UserResourceProgress"("userId", "resourceId");

-- CreateIndex
CREATE INDEX "LearningPath_userId_idx" ON "LearningPath"("userId");

-- CreateIndex
CREATE INDEX "LearningPath_isPublic_idx" ON "LearningPath"("isPublic");

-- CreateIndex
CREATE INDEX "LearningPath_targetRole_idx" ON "LearningPath"("targetRole");

-- CreateIndex
CREATE INDEX "MicroOpportunity_type_idx" ON "MicroOpportunity"("type");

-- CreateIndex
CREATE INDEX "MicroOpportunity_status_idx" ON "MicroOpportunity"("status");

-- CreateIndex
CREATE INDEX "MicroOpportunity_difficulty_idx" ON "MicroOpportunity"("difficulty");

-- CreateIndex
CREATE INDEX "LearningStreak_userId_idx" ON "LearningStreak"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "LearningStreak_userId_key" ON "LearningStreak"("userId");

-- CreateIndex
CREATE INDEX "LearningAchievement_userId_idx" ON "LearningAchievement"("userId");

-- CreateIndex
CREATE INDEX "LearningAchievement_achievementType_idx" ON "LearningAchievement"("achievementType");

-- CreateIndex
CREATE INDEX "ResourceFeedback_userId_idx" ON "ResourceFeedback"("userId");

-- CreateIndex
CREATE INDEX "ResourceFeedback_resourceId_idx" ON "ResourceFeedback"("resourceId");

-- CreateIndex
CREATE INDEX "ResourceFeedback_feedbackType_idx" ON "ResourceFeedback"("feedbackType");

-- CreateIndex
CREATE INDEX "QuantumLearningState_userId_idx" ON "QuantumLearningState"("userId");

-- CreateIndex
CREATE INDEX "QuantumLearningState_futureJobMarketFit_idx" ON "QuantumLearningState"("futureJobMarketFit");

-- CreateIndex
CREATE UNIQUE INDEX "QuantumLearningState_userId_key" ON "QuantumLearningState"("userId");

-- CreateIndex
CREATE INDEX "AIPersona_userId_idx" ON "AIPersona"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "AIPersona_userId_key" ON "AIPersona"("userId");

-- CreateIndex
CREATE INDEX "BrainSyncSession_userId_idx" ON "BrainSyncSession"("userId");

-- CreateIndex
CREATE INDEX "BrainSyncSession_sessionType_idx" ON "BrainSyncSession"("sessionType");

-- CreateIndex
CREATE INDEX "BrainSyncSession_flowStateAchieved_idx" ON "BrainSyncSession"("flowStateAchieved");

-- CreateIndex
CREATE INDEX "SkillEvolutionTimeline_userId_idx" ON "SkillEvolutionTimeline"("userId");

-- CreateIndex
CREATE INDEX "SkillEvolutionTimeline_skillName_idx" ON "SkillEvolutionTimeline"("skillName");

-- CreateIndex
CREATE INDEX "SkillEvolutionTimeline_marketDemand_idx" ON "SkillEvolutionTimeline"("marketDemand");

-- CreateIndex
CREATE INDEX "SkillEvolutionTimeline_futureDemand2030_idx" ON "SkillEvolutionTimeline"("futureDemand2030");

-- CreateIndex
CREATE UNIQUE INDEX "SkillEvolutionTimeline_userId_skillName_key" ON "SkillEvolutionTimeline"("userId", "skillName");

-- CreateIndex
CREATE INDEX "CollectiveIntelligence_topicCluster_idx" ON "CollectiveIntelligence"("topicCluster");

-- CreateIndex
CREATE INDEX "CollectiveIntelligence_trendingMomentum_idx" ON "CollectiveIntelligence"("trendingMomentum");

-- CreateIndex
CREATE UNIQUE INDEX "CollectiveIntelligence_topicCluster_key" ON "CollectiveIntelligence"("topicCluster");

-- CreateIndex
CREATE INDEX "NeuralRecommendation_userId_idx" ON "NeuralRecommendation"("userId");

-- CreateIndex
CREATE INDEX "NeuralRecommendation_recommendationType_idx" ON "NeuralRecommendation"("recommendationType");

-- CreateIndex
CREATE INDEX "NeuralRecommendation_urgencyLevel_idx" ON "NeuralRecommendation"("urgencyLevel");

-- CreateIndex
CREATE INDEX "NeuralRecommendation_status_idx" ON "NeuralRecommendation"("status");

-- CreateIndex
CREATE INDEX "FutureSelfSimulation_userId_idx" ON "FutureSelfSimulation"("userId");

-- CreateIndex
CREATE INDEX "FutureSelfSimulation_simulationDate_idx" ON "FutureSelfSimulation"("simulationDate");

-- CreateIndex
CREATE INDEX "EmotionalIntelligenceProfile_userId_idx" ON "EmotionalIntelligenceProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "EmotionalIntelligenceProfile_userId_key" ON "EmotionalIntelligenceProfile"("userId");

-- CreateIndex
CREATE INDEX "SkillMarketplaceTrade_offererId_idx" ON "SkillMarketplaceTrade"("offererId");

-- CreateIndex
CREATE INDEX "SkillMarketplaceTrade_receiverId_idx" ON "SkillMarketplaceTrade"("receiverId");

-- CreateIndex
CREATE INDEX "SkillMarketplaceTrade_status_idx" ON "SkillMarketplaceTrade"("status");

-- CreateIndex
CREATE INDEX "SkillMarketplaceTrade_skillOffered_idx" ON "SkillMarketplaceTrade"("skillOffered");

-- CreateIndex
CREATE INDEX "SkillMarketplaceTrade_skillRequested_idx" ON "SkillMarketplaceTrade"("skillRequested");

-- AddForeignKey
ALTER TABLE "CareerDNA" ADD CONSTRAINT "CareerDNA_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserResourceProgress" ADD CONSTRAINT "UserResourceProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LearningPath" ADD CONSTRAINT "LearningPath_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LearningStreak" ADD CONSTRAINT "LearningStreak_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LearningAchievement" ADD CONSTRAINT "LearningAchievement_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResourceFeedback" ADD CONSTRAINT "ResourceFeedback_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuantumLearningState" ADD CONSTRAINT "QuantumLearningState_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AIPersona" ADD CONSTRAINT "AIPersona_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BrainSyncSession" ADD CONSTRAINT "BrainSyncSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SkillEvolutionTimeline" ADD CONSTRAINT "SkillEvolutionTimeline_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NeuralRecommendation" ADD CONSTRAINT "NeuralRecommendation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FutureSelfSimulation" ADD CONSTRAINT "FutureSelfSimulation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmotionalIntelligenceProfile" ADD CONSTRAINT "EmotionalIntelligenceProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SkillMarketplaceTrade" ADD CONSTRAINT "SkillMarketplaceTrade_offererId_fkey" FOREIGN KEY ("offererId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SkillMarketplaceTrade" ADD CONSTRAINT "SkillMarketplaceTrade_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
