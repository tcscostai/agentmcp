
import os
from datetime import datetime
from jira import JIRA
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class saurabh:
    def __init__(self):
        self.jira = JIRA(
            server=os.getenv('JIRA_URL'),
            basic_auth=(os.getenv('JIRA_USERNAME'), os.getenv('JIRA_TOKEN'))
        )
        self.project_key = os.getenv('JIRA_PROJECT_KEY')
        logger.info(f"Initialized {self.__class__.__name__} with project key: {self.project_key}")

    async def execute_task(self, task_type, params=None):
        """Execute agent tasks based on type"""
        try:
            if task_type == 'analyze_requirements':
                return await self.analyze_requirements(params)
            elif task_type == 'generate_test_cases':
                return await self.generate_test_cases(params)
            elif task_type == 'run_test_suite':
                return await self.run_test_suite(params)
            else:
                raise ValueError(f"Unknown task type: {task_type}")
        except Exception as e:
            logger.error(f"Error executing task {task_type}: {str(e)}")
            raise

    async def analyze_requirements(self, story_key):
        """Analyze requirements for a given story"""
        try:
            story = self.jira.issue(story_key)
            analysis = await self._analyze_with_openai(story.fields.description)
            return {
                'story_key': story_key,
                'analysis': analysis,
                'timestamp': datetime.now().isoformat()
            }
        except Exception as e:
            logger.error(f"Error analyzing requirements: {str(e)}")
            raise

    async def generate_test_cases(self, story_key):
        """Generate test cases for a story"""
        try:
            story = self.jira.issue(story_key)
            test_cases = await self._generate_test_cases_with_openai(
                story.fields.description,
                getattr(story.fields, 'customfield_10016', '') # Acceptance criteria
            )
            return {
                'story_key': story_key,
                'test_cases': test_cases,
                'timestamp': datetime.now().isoformat()
            }
        except Exception as e:
            logger.error(f"Error generating test cases: {str(e)}")
            raise

    async def _analyze_with_openai(self, description):
        """Use OpenAI to analyze requirements"""
        try:
            response = await openai.chat.completions.create(
                model="gpt-4",
                messages=[
                    {"role": "system", "content": "You are an expert requirements analyst."},
                    {"role": "user", "content": f"Analyze these requirements:
{description}"}
                ]
            )
            return response.choices[0].message.content
        except Exception as e:
            logger.error(f"OpenAI API error: {str(e)}")
            raise

    async def _generate_test_cases_with_openai(self, description, acceptance_criteria):
        """Use OpenAI to generate test cases"""
        try:
            response = await openai.chat.completions.create(
                model="gpt-4",
                messages=[
                    {"role": "system", "content": "You are an expert test case designer."},
                    {"role": "user", "content": f"""
                        Generate test cases for:
                        Description: {description}
                        Acceptance Criteria: {acceptance_criteria}
                    """}
                ]
            )
            return response.choices[0].message.content
        except Exception as e:
            logger.error(f"OpenAI API error: {str(e)}")
            raise
