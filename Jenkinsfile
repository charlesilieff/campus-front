def remote = [:]
remote.name = 'campusDev'
remote.host = '192.168.1.26'
remote.user = 'debian'
remote.password = PASSWORD_LXC_TEST_CAMPUS
remote.allowAnyHosts = true

pipeline {
    agent any
    options {
            ansiColor('xterm')
        }
    environment {
            DOCKER_IMAGE_NAME = "campus-front-dev"
        }    
    stages {
        stage('Install') {
            steps {
                script { if (env.GIT_BRANCH == "origin/main")
                        {
                         echo "WARNING PROD DEPLOYMENT !!!!"
                         remote.host = '192.168.1.25'
                         remote.name = 'campusProd'
                         DOCKER_IMAGE_NAME = "campus-front"
                         echo "Docker image name is now: ${DOCKER_IMAGE_NAME}"
                         }
                      }
                echo "Npm install..."
                sh "npm install"
            }
        }
        stage('Lint') {
            steps {
                echo "Linting..."
                sh "npm run lint"
            }
        }
        stage('Package') {
            steps {
                echo "Compiling with vite..."
                sh "npm run vite-build"
            }
        }
        stage('Docker push'){
            steps {
                echo "Building docker..."
                sh "docker build . -t docker.ilieff.fr/${DOCKER_IMAGE_NAME}:1.0.5 -t docker.ilieff.fr/${DOCKER_IMAGE_NAME}:latest"
                echo "Login to Ilieff docker repo"
                sh "docker login docker.ilieff.fr -u charles -p${DOCKER_REPO_PASSWORD}"
                echo "Push docker..."
                sh "docker push --all-tags docker.ilieff.fr/${DOCKER_IMAGE_NAME}"
            }
       }
       stage('Deploy') {
            steps {
                sshCommand remote: remote, command: "docker stop ${DOCKER_IMAGE_NAME}"
                sshCommand remote: remote, command: "docker rm ${DOCKER_IMAGE_NAME}"
                sshCommand remote: remote, command: "docker system prune -a --volumes -f"
                sshCommand remote: remote, command: "docker run -d --restart unless-stopped --name ${DOCKER_IMAGE_NAME} --pull=always -p 80:80 docker.ilieff.fr/${DOCKER_IMAGE_NAME}:latest"
            }
        }
        
   }
   post {
        always
            {
              echo "Docker and dist cleaning..."
//               cleanWs()
                    script    {
                    sh "docker system prune -a -f"
                    sh "rm -r dist"                   
                    }
            }
    }
}