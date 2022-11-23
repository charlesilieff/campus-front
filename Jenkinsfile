pipeline {
    agent any
    stages {
        stage('Install') {
            steps {

                echo "Npm install..."
                sh "npm install"
            }
        }
        stage('Package') {
            steps {
                echo "Compiling with parcel..."
                sh "npx parcel build src/main.html"
            }
        }
        stage('Docker'){
            steps {
                echo "Building docker..."
                sh "docker build . -t docker.ilieff.fr/campus-front"
                echo "Login to Ilieff docker repo"
                sh "cat docker_password | docker login docker.ilieff.fr -u charles -p${DOCKER_REPO_PASSWORD}"
                echo "Push docker..."
                sh "docker push docker.ilieff.fr/campus-front"
            }
       }
   }
}