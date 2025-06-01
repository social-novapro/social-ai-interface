const interactAIResponse = require("../../schemas/interactAIResponse");
const { checktime } = require("../checktime");
const { v4: UUIDv4 } = require('uuid');
const { ollamaRequest } = require("../ollamaRequest");
const { categoryExample } = require("./prompts.json");

const EXAMPLE_COUNT = 5;

async function generateExamples(categoryName) {
    const generatedExamples = [];
    const generatedExamplesResponses = [];

    for (let i = 0; i < EXAMPLE_COUNT; i++) {
        const example = await genCategoryExample(categoryName, generatedExamplesResponses);
        if (example.error) {
            console.error(`Error generating example ${i + 1}:`, example.error);
        } else {
            generatedExamples.push(example);
            generatedExamplesResponses.push(example.response);
        }
    }

    console.log(`Generated ${generatedExamples.length} examples for category: ${categoryName}`);
    console.log(`Generated examples:`, generatedExamplesResponses);
    return generatedExamples;
}

async function genCategoryExample(categoryName, examples) {
    const startTime = checktime();
    if (!categoryName) return { error: "Category name is required" };

    var dataUse = {
        categoryName: categoryName,
        examples: examples ? examples.join("\n") : "",
    }
    
    var fullPromptCatGen = categoryExample.prompt.join('\n');
    for (const replacement of categoryExample.replacements) {
        for (var i = 0; i < replacement.occurrences; i++) {
            fullPromptCatGen = fullPromptCatGen.replace(`{${replacement.key}}`, dataUse[replacement.key]);
        }
    }

    const startTimeOllama = checktime();
    const ollamaResponse = await ollamaRequest(fullPromptCatGen, categoryExample.model);
    const endTime = checktime();
    console.log(`Time to get total: ${endTime - startTime}ms, Time to get categoryExample: ${endTime - startTimeOllama}ms`)

    if (ollamaResponse.error) {
        return { error: ollamaResponse.error };
    }

    const structuredResponse = {
        response: ollamaResponse.response,
        // usersTotal,
        generationType: "categoryExample",
        foundUsername : categoryName ?? "Server-Client",
        totalPosts : examples.length,
        totalChars : examples.reduce((acc, example) => acc + example.length, 0),
        responseLength: ollamaResponse.response.length,
        totalTime: endTime - startTime,
        ollamaTime: endTime - startTimeOllama,
        modelName: categoryExample.model,
        versionNumber: categoryExample.version,
    }
    
    try {
        await interactAIResponse.create({
            _id: UUIDv4(),
            current: true,
            timestamp: checktime(),
            ...structuredResponse,
        })
    } catch (error) {
        console.log(error)
    }

    return structuredResponse;
}

module.exports = {
    generateExamples
};