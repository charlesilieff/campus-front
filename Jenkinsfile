def remote = [:]
remote.name = 'campusTest'
remote.host = '192.168.1.25'
remote.user = 'debian'
remote.password = PASSWORD_LXC_TEST_CAMPUS
remote.allowAnyHosts = true

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
        stage('Docker push'){
            steps {
                echo "Building docker..."
                sh "docker build . -t docker.ilieff.fr/campus-front"
                echo "Login to Ilieff docker repo"
                sh "docker login docker.ilieff.fr -u charles -p${DOCKER_REPO_PASSWORD}"
                echo "Push docker..."
                sh "docker push docker.ilieff.fr/campus-front"
            }
       }
       stage('Deploy') {
            steps {
                sshCommand remote: remote, command: "docker stop campus-front"
                sshCommand remote: remote, command: "docker rm campus-fron"
                sshCommand remote: remote, command: "docker run -d --restart unless-stopped --name campus-front --pull=always -p 80:80 docker.ilieff.fr/campus-front:latest"
            }
        }
   }
}